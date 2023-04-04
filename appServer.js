const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const morgan = require("morgan")
const cors = require("cors")


const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("./errors.js")

const { asyncWrapper } = require("./asyncWrapper.js")

const dotenv = require("dotenv")
dotenv.config();



const app = express()
// const port = 5000
var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB({ "drop": false });
  const pokeSchema = await getTypes();
  // pokeModel = await populatePokemons(pokeSchema);
  pokeModel = mongoose.model('pokemons', pokeSchema);

  app.listen(process.env.pokeServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.pokeServerPORT}`);
  })
})
start()
app.use(express.json())
const jwt = require("jsonwebtoken")
// const { findOne } = require("./userModel.js")
const userModel = require("./userModel.js")





// app.use(morgan("tiny"))
app.use(morgan(":method"))

app.use(cors())

const authUser = asyncWrapper(async (req, res, next) => {

  const authorizationHeader = req.header('Authorization');

  // header parsing goes here
  const beforeBearer = authorizationHeader?.split("Bearer ")[1].split(" Refresh")[0];
  const afterRefresh = authorizationHeader?.split("Refresh ")[1];


  if (!authorizationHeader) {
    // throw new PokemonAuthError("No Token: Please provide an appid query parameter.")
    // throw new PokemonAuthError("No Token: Please provide the access token using the headers.")
    res.status(401).send("No Token: Please provide the access token using the headers.");
  }
  try {
    const verified = jwt.verify(beforeBearer, process.env.ACCESS_TOKEN_SECRET)
    
    
    // check whether the token is in the db
    const user = await userModel.findOne({ username })
    if (!user)
      throw new PokemonAuthError("User not found")
    if (!user.token_valid) {
      res.status( 401).send("Invalid Token Verification. Log in again.");
    }

    
    // console.log("We're in the try block of authUser");
    next()
  } catch (err) {
    res.status(401).send("No Token: Please provide the access token using the headers.");

  }
})

const authAdmin = asyncWrapper(async (req, res, next) => {

  // header parsing goes here
  const authorizationHeader = req.header('Authorization');
  const beforeBearer = authorizationHeader?.split("Bearer ")[1].split(" Refresh")[0];
  const afterRefresh = authorizationHeader?.split("Refresh ")[1];

  const payload = jwt.verify(beforeBearer, process.env.ACCESS_TOKEN_SECRET)

  if (payload?.user?.role == "admin") {
    return next()
  }
  res.status(401).send("Access denied");
})

app.use(authUser) // Boom! All routes below this line are protected
app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  // try {
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
  // } catch (err) { res.json(handleErr(err)) }
}))

app.get('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  try {
    console.log("Pokemon get request here")
    const { id } = req.query
    console.log("Pokemon id is : ", id);
    const docs = await pokeModel.find({ "id": id })
    if (docs.length != 0) res.json(docs)
    else res.json({ errMsg: "Pokemon not found" })
  } catch (err) { 
    res.status(401).send("Unauthorized user");
  }
}));



app.use(authAdmin)
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  // try {
  console.log(req.body);
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
}))

app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  // try {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    throw new PokemonNotFoundError("");
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    throw new PokemonNotFoundError("");
  }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    throw new PokemonNotFoundError("");
  }
}))



app.get('/report', (req, res) => {
  console.log("Report requested");
  res.send(`Table ${req.query.id}`)
})


app.use(handleErr)


module.exports = app;