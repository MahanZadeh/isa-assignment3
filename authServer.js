const express = require("express")
const { handleErr } = require("./errorHandler.js")
const { asyncWrapper } = require("./asyncWrapper.js")
const dotenv = require("dotenv")
dotenv.config();
const userModel = require("./userModel.js")
const { connectDB } = require("./connectDB.js")
const cors = require("cors")


const {
  PokemonBadRequest,
  PokemonDbError,
  PokemonAuthError
} = require("./errors.js")

const app = express()

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });


  app.listen(process.env.authServerPORT, async (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.authServerPORT}`);
    const doc = await userModel.findOne({ "username": "admin" })
    if (!doc)
      userModel.create({ username: "admin", password: bcrypt.hashSync("admin", 10), role: "admin", email: "admin@admin.ca" })
  })
})
start()

app.use(express.json())
app.use(cors({
  exposedHeaders: ['auth-token-access', 'auth-token-refresh']
}))

const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

const jwt = require("jsonwebtoken")
let refreshTokens = [] //TODO replace with user DB lastaccesstoken and lastrefreshtoken to track the last good tokens
app.post('/requestNewAccessToken', asyncWrapper(async (req, res) => {
  try {
    // console.log(req.headers);
    authorizationHeader = req.headers.authorization
    const refreshToken = authorizationHeader.split("Refresh ")[1];
    if (!refreshToken) {  // 
      throw new PokemonAuthError("No Token: Please provide a token.")
    }
    if (!refreshTokens.includes(refreshToken)) { //TODO replaced a db access
      console.log("token: ", refreshToken);
      console.log("refreshTokens", refreshTokens);
      throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
    }
    try {
      const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const accessToken = jwt.sign({ user: payload.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
      res.header('auth-token-access', accessToken)
      //res.header("Authorization", Bearer ${accessToken} Refresh ${refreshToken});
      res.send("All good!")
    } catch (error) {
      throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
    }
  } catch(err) {
   res.status(401).send("Poke API Error - Authentication Error: Password is incorrect")
  }


}))

app.post('/login', (async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (!user)
      throw new PokemonAuthError("User not found")
  
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
      throw new PokemonAuthError("Password is incorrect")
  
  
    const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    const refreshToken = jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
  
    
    res.header("Authorization", `Bearer ${accessToken} Refresh ${refreshToken}`);
    user.token_valid = true;

    res.send(user)
  } catch (err) {
    res.status(401).send("Poke API Error - Authentication Error: Credentials are incorrect")
  }

}))


app.get('/logout', asyncWrapper(async (req, res) => {

  const user = await userModel.findOne({ token: req.query.appid })
  if (!user) {
    throw new PokemonAuthError("User not found")
  }
  await userModel.updateOne({ token: user.token }, { token_valid: false })
  res.status(200).send("Logged out")
}))

module.exports = app;