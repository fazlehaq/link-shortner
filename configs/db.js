require("dotenv").config();
const mongoose = require("mongoose");

async function dbConnect() {
  try {
    mongoose.connect(process.env.DB);
    console.log("MongoDB connected!!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
}

module.exports = dbConnect;
