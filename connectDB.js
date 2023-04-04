const { mongoose } = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();
// console.log(process.env)

const connectDB = async (input) => {
  try {
    const x = await mongoose.connect(process.env.DB_STRING)
    // const x = await mongoose.connect("mongodb+srv://victor:g42cCXOUoYQxj4FI@cluster0.ovbcmld.mongodb.net/test")
    console.log("Connected to db");
    if (input.drop === true)
      mongoose.connection.db.dropDatabase();
    // console.log("Dropped db");
    // get the data from Github 
  } catch (error) {
    console.log('db error');
  }
}

module.exports = { connectDB }