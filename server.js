const express = require("express");
require("dotenv").config();
const connectDB = require("./db/configDB");
const app = express();
const authRoute = require("./Router/authRoute.js");
const usersRoute = require("./Router/userRoute.js");
const passwordRoute = require("./Router/passwordRoute.js");
const path = require("path");
const passport = require("passport");
require("./db/passport.js");
const cors = require("cors");

//connected MongoDB
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , "images")));

// //setting db/passport
app.use(passport.initialize())


//setting ejs
app.set("view engine" , "ejs");
app.set("views" , "./views");

//Routes
app.use("/api/auth" , authRoute);
app.use("/api/users" , usersRoute);
app.use("/password" , passwordRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT , () => console.log("server is live"));