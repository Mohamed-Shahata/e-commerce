const mongoose = require("mongoose");

const URL = process.env.MONGODB_URL;
const connectDB = () =>  mongoose.connect(URL).then(() => {
  console.log("connected");
  require("../utils/deleteInActiveUsers.js");
}).catch((error)=> {
  console.log("disconnected mongoDB: " ,error);
});


module.exports = connectDB;