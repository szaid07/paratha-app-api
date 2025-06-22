const mongoose = require("mongoose");
require("dotenv").config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://myfinancesafe:Szaid008@paratha-app.m0pkdab.mongodb.net/?retryWrites=true&w=majority&appName=Paratha-App";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
