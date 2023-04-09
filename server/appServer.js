const express = require("express");
const { connectDB } = require("./connectDB.js");
const { populatePokemons } = require("./populatePokemons.js");
const { getTypes } = require("./schemas/getTypes.js");
const { handleErr } = require("./errors/errorHandler.js");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError
} = require("./errors/errors.js");
const { asyncWrapper } = require("./errors/asyncWrapper.js");
const dotenv = require("dotenv");
const cors = require("cors");
const apiUserStats = require("./schemas/apiUserStats");
const topUserEndPoints = require("./schemas/topUsersEndpoint");
const routeAccesLog = require("./schemas/routeAccessLogSchema");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods:['GET', 'POST', 'PUT', 'DELETE']
  })
);

var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB();
  const pokeSchema = await getTypes();
  pokeModel = await populatePokemons(pokeSchema);

  app.listen(process.env.pokeServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.pokeServerPORT}`);
  })
})

start();

const auth = (req, res, next) => {
  const token = req.cookies['access_token'];
  console.log("Authentication token: " + token);

  if (!token) {
    throw new PokemonBadRequest("Access denied");
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET); // nothing happens if token is valid
    morgan.token('username', (req, res) => { return JSON.stringify(req.cookies['username']) })
    next();
  } catch (err) {
    throw new PokemonBadRequest("Invalid token");
  }
}

const adminAuth = (req, res, next) => {
  var isAdmin = req.cookies['is_admin'];

  if (!isAdmin) {
    throw new PokemonBadRequest("Access Denied - Account Does Not Have Admin Privledges");
  };

  try {
    if (isAdmin == 'false') {
      throw new err;
    }
    next();
  } catch (err) {
    throw new PokemonBadRequest("Access Denied - Account Does Not Have Admin Privledges");
  }
}

const logUniqueAPIUsers = async (username) => {

  try {
    const visit = await apiUserStats.findOne({
      date: new Date().toISOString().substring(0, 10)
    });

    if (visit) {
      let added = false;
      visit.stats.forEach((s, index) => {
        if (s.user == username) {
          visit.stats[index].apiAccessCount += 1;
          added = true;
        }
      });

      if (!added) {
        visit.stats.push({
          user: username,
        });
      }

      visit.save();

    } else {
      apiUserStats.create({
        stats: [
          {
            user: username,
          }
        ]
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const logEndPointUsage = async (username, apiEndpoint) => {

  try {
    const endpointVisit = await topUserEndPoints.findOne({endpoint: apiEndpoint});

    if (endpointVisit) {
      let added = false;
      endpointVisit.access.forEach((s, index) => {
        if (s.user == username) {
          endpointVisit.access[index].count += 1;
          added = true;
        }
      });

      if (!added) {
        endpointVisit.access.push({
          user: username,
        });
      }

      endpointVisit.save();

    } else {
      topUserEndPoints.create({
        endpoint: apiEndpoint,
        access: [
          {
            user: username,
          }
        ]
      });
    }
  } catch (err) {
    console.log(err);
  }
};


const logRouteAccess = async (apiEndpoint, statusNum, method) => {

  try {
    routeAccesLog.create({
      endpoint: apiEndpoint,
      method: method,
      status: statusNum, 
    });

  } catch (err) {
    console.log(err);
  }
}

app.use(auth) // Boom! All routes below this line are protected

app.use(morgan(":method :url :status :username"));
app.use(morgan((token, req, res) => {
  let username = req.cookies['username'];
  let endpoint  = token.url(req);
  let status = token.status(req, res);
  let method = token.method(req, res);

  logUniqueAPIUsers(username);
  logEndPointUsage(username, endpoint);
  logRouteAccess(endpoint, status, method);
}));

app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
  res.json(docs);
}))

app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const docs = await pokeModel.find({ "id": id });
  if (docs.length != 0) res.json(docs);
  else res.json({ errMsg: "Pokemon not found" });
}))


app.use(adminAuth);

/** ADMIN ACCESS ONLY */

app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  if (!req.body.id) throw new PokemonBadRequestMissingID();
  const poke = await pokeModel.find({ "id": req.body.id });
  if (poke.length != 0) throw new PokemonDuplicateError();
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  });
}))


app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
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
  const selection = { id: req.params.id };
  const update = req.body;
  const options = {
    new: true,
    runValidators: true
  };
  const doc = await pokeModel.findOneAndUpdate(selection, update, options);
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    });
  } else {
    throw new PokemonNotFoundError("");
  }
}));

app.delete('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  const docs = await pokeModel.findOneAndRemove({ id: req.params.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    });
  else
    throw new PokemonNotFoundError("");
}))

app.get('/api/v1/pokemonImage/:id', (req, res) => {
    
  let searchParam = req.params.id;
  
  if (isNaN(parseInt(searchParam)) || parseInt(searchParam) > 801) {
      res.send("PLEASE ENTER A VALID POKEMON ID!");
      return;
  }

  searchParam = searchParam.padStart(3, "0");
  
  res.send("https://github.com/fanzeyi/pokemon.json/blob/master/images/" + searchParam + ".png");
});

app.post('/admin/users', asyncWrapper(async (req, res)  => {
  // const date = new Date(req.body.date).toISOString().substring(0, 10);
  const date = req.body.date;
  const userDocs = await apiUserStats.findOne({date: date});
  var uniqueUsers = [];

  if (userDocs) {
    userDocs.stats.forEach((s, index) => {
      var userData = {};
      userData["userName"] = userDocs.stats[index].user;
      userData["accessCount"] = userDocs.stats[index].apiAccessCount;
      userData["date"] = date;
      uniqueUsers.push(userData);
    })
  }

  res.json(uniqueUsers);
}));


app.post('/admin/unique', asyncWrapper(async (req, res) => {
  const userDocs = await apiUserStats.find({
    $and: [
      {'date': { $lte: req.body.endDate}},
      {'date': {$gte: req.body.startDate}}
  ]});

  res.json(userDocs);
}))

app.get('/admin/endpoints', asyncWrapper(async (req, res) => {
  const userDocs = await topUserEndPoints.find({})
  res.json(userDocs);
}))

app.get('/admin/accesslogs', asyncWrapper(async(req, res) => {
  const userDocs = await routeAccesLog.find({});
  res.json(userDocs);
}))

/** ADMIN ACCESS ENDS */

app.get("*", (req, res) => {
  throw new PokemonNoSuchRouteError("");
});

app.use(handleErr);