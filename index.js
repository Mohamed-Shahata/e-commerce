// 1. الواردات الأساسية والمكتبات الخارجية
const express = require("express");
require("dotenv").config();
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db.js");
require("./config/passport.js");

const authRoute = require("./Router/authRoute.js");
const usersRoute = require("./Router/userRoute.js");
const passwordRoute = require("./Router/passwordRoute.js");
const productsRoute = require("./Router/productRoute.js");
const payment = require("./Router/paymentRoute.js");

const app = express();


connectDB();

//middlewares
app.use(cors({
    origin: "https://e-commerce-production-2d41.up.railway.app/",
    credentials: true, 
  }));
app.use(compression());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , "images")));
app.use(cookieParser());


//setting db/passport
app.use(passport.initialize())

//setting ejs
app.set("view engine" , "ejs");
app.set("views" , "./views");

//Routes
app.use("/api/auth" , authRoute);
app.use("/api/users" , usersRoute);
app.use("/password" , passwordRoute);
app.use("/api/products" , productsRoute);
app.use("/api" , payment);

//listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT , () => console.log("server is live"));