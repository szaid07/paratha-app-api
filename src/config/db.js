const mongoose = require("mongoose");
require("dotenv").config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://myfinancesafe:Szaid008@paratha-app.m0pkdab.mongodb.net/?retryWrites=true&w=majority&appName=Paratha-App";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.log("App will continue without database connection");
    // Don't exit the process, let the app run without DB
    // process.exit(1);
  }
};

module.exports = connectDB;
