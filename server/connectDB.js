const { mongoose } = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();
// console.log(process.env)

const connectDB = async () => {
  try {
    console.log("DB_STRING:", process.env.DB_STRING); // Add this line

    const x = await mongoose.connect(process.env.DB_STRING);
    console.log("Connected to db");
    //mongoose.connection.db.dropDatabase();
    // console.log("Dropped db");

  } catch (error) {
    console.log('db error:', error);
  }
}

module.exports = { connectDB }