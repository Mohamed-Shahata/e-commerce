const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db.js");
const app = express();
const path = require("path");
const passport = require("passport");
require("./config/passport.js");
const cors = require("cors");
const compression = require("compression");
const authRoute = require("./Router/authRoute.js");
const usersRoute = require("./Router/userRoute.js");
const passwordRoute = require("./Router/passwordRoute.js");
const passwordMobileRoute = require("./Router/passwordMobileRoute.js");
const productsRoute = require("./Router/productRoute.js");
const payment = require("./Router/paymentRoute.js");
const cookieParser = require("cookie-parser");


connectDB();

//middlewares
app.use(cors({
  credentials: true
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
app.use("/password-mobile" , passwordMobileRoute);
app.use("/api/products" , productsRoute);
app.use("/api" , payment);

// Global Error
app.use((err, req, res, next) => {
  const { status, message, stack } = err;
  res
    .status(status || 500)
    .json(message, ...(process.env.MODE === "development" && { stack }));
});
//listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT , () => console.log("server is live"));