import express, { json, urlencoded } from "express";
import connectDB from "./config/db.js";
import { join } from "path";
import passport from "passport";
import "./config/passport.js";
import cors from "cors";
import compression from "compression";
import { authRouter } from "./Router/authRoute.js";
import usersRoute from "./Router/userRoute.js";
import passwordRoute from "./Router/passwordRoute.js";
import passwordMobileRoute from "./Router/passwordMobileRoute.js";
import productsRoute from "./Router/productRoute.js";
import payment from "./Router/paymentRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { categoryRouter } from "./Router/category.routes.js";
import { subCategoryRouter } from "./Router/SubCategory..routes.js";

dotenv.config();
connectDB();

// Middlewares
app.use(
  cors({
    origin: "https://e-commerce-production-2d41.up.railway.app/api",
    credentials: true,
  })
);

app.use(compression());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Setting DB/Passport
app.use(passport.initialize());

// Setting EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/users", usersRoute);
app.use("/password", passwordRoute);
app.use("/password-mobile", passwordMobileRoute);
app.use("/api/products", productsRoute);
app.use("/api", payment);

// Global Error Handler
app.use((err, req, res, next) => {
  const { status, message, stack } = err;
  res.status(status || 500).json(message, ...(process.env.MODE === "development" && { stack }));
});

// Listen Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is live"));
