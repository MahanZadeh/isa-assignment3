const express = require("express");
const { handleErr } = require("./errors/errorHandler.js");
const { asyncWrapper } = require("./errors/asyncWrapper.js");
const dotenv = require("dotenv");
const userModel = require("./schemas/userModel");
const cookieParser = require('cookie-parser');
const { connectDB } = require("./connectDB.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  PokemonBadRequest,
  PokemonDbError,
} = require("./errors/errors.js");

const app = express()
dotenv.config();
app.use(express.json())
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods:['GET', 'POST', 'PUT', 'DELETE']
  })
);


const start = asyncWrapper(async () => {
  await connectDB();
  app.listen(process.env.authServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err);
    else
      console.log(`Phew! Server is running on port: ${process.env.authServerPORT}`);
  })
});

start();

app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email, admin } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const accessToken = jwt.sign({ _id: username }, process.env.TOKEN_SECRET);
  const userWithHashedPassword = { ...req.body, password: hashedPassword, apiKey: accessToken};

  const user = await userModel.create(userWithHashedPassword);
  res.send({msg: "Registered!", apiKey: user.apiKey});
}));

app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });
  if (!user) {
    throw new PokemonBadRequest("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new PokemonBadRequest("Password is incorrect")
  }
  res.cookie("username", user.username, { maxAge: 2 * 60 * 60 * 1000 });
  res.cookie("access_token", user.apiKey, { maxAge: 2 * 60 * 60 * 1000 });
  res.cookie("is_admin", user.admin, { 
    maxAge: 2 * 60 * 60 * 1000, 
  });
  res.json({apiKey: user.apiKey, isAdmin: user.admin, msg: "logged in!"});
}));

app.post('/logout', asyncWrapper( async (req, res) => {

  res.clearCookie("access_token");
  res.clearCookie("is_admin");
  res.json({msg: "LOGGED OUT"});
}));

app.get("/authUser", async (req, res) => {
  res.json({ error: 0, data: req.cookies});
})

app.use(handleErr);