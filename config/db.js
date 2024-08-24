const mongoose = require("mongoose");

const URL = process.env.MONGODB_URL;
const connectDB = () =>  mongoose.connect(URL , {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000
}).then(() => {
  console.log("connected");
  require("../utils/deleteInActiveUsers.js");
}).catch((error)=> {
  console.log("disconnected mongoDB: " ,error);
});


module.exports = connectDB;