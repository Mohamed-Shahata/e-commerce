<<<<<<< HEAD
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
=======
import express, { json, urlencoded } from "express";
>>>>>>> c3be5061bc9dc70aa8a126f29177a0fe0b44a23c

import connectDB from "./config/db.js";
const app = express();
import { join } from "path";
import passport from "passport";
import "./config/passport.js";
import cors from "cors";
import compression from "compression";
import { authRouter } from "./Router/authRoute.js";
import usersRoute from "./Router/userRoute.js";
import passwordRoute from "./Router/passwordRoute.js";
import productsRoute from "./Router/productRoute.js";
import payment from "./Router/paymentRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { categoryRouter } from "./Router/category.routes.js";
import { subCategoryRouter } from "./Router/SubCategory..routes.js";
dotenv.config();

connectDB();

//middlewares
app.use(
  cors({
    origin: "https://e-commerce-production-2d41.up.railway.app/api",
    credentials: true,
  })
);

app.use(compression());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
// app.use(static(join(__dirname, "images")));
app.use(cookieParser());

//setting db/passport
app.use(passport.initialize());

//setting ejs
app.set("view engine", "ejs");
app.set("views", "./views");

//Routes
<<<<<<< HEAD
app.use("/api/auth" , authRoute);
app.use("/api/users" , usersRoute);
app.use("/password" , passwordRoute);
app.use("/password-mobile" , passwordMobileRoute);
app.use("/api/products" , productsRoute);
app.use("/api" , payment);
=======
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/users", usersRoute);
app.use("/password", passwordRoute);
app.use("/api/products", productsRoute);
app.use("/api", payment);
>>>>>>> c3be5061bc9dc70aa8a126f29177a0fe0b44a23c

// Global Error
app.use((err, req, res, next) => {
  const { status, message, stack } = err;
  res
    .status(status || 500)
    .json(message, ...(process.env.MODE === "development" && { stack }));
});
//listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is live"));
