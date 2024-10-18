import express, { json, urlencoded } from "express";

import connectDB from "./config/db.js";
const app = express();
import passport from "passport";
import "./config/passport.js";
import cors from "cors";
import compression from "compression";
import { authRouter } from "./Router/authRoute.js";
import usersRoute from "./Router/userRoute.js";
import passwordRoute from "./Router/passwordRoute.js";
import { productsRoute } from "./Router/productRoute.js";
import payment from "./Router/paymentRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passwordMobileRoute from "./Router/passwordMobileRoute.js";
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
