import express, { json, urlencoded } from "express";
import { dirname , join } from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
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

const app = express();

const __filename = fileURLToPath(import.meta.url); // احصل على اسم الملف الحالي
const __dirname = dirname(__filename); // احصل على الدليل الحالي

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
app.use(express.static(join(__dirname, "images"))); // تقديم ملفات الصور
app.use(cookieParser());

//setting db/passport
app.use(passport.initialize());

//setting ejs
app.set("view engine", "ejs");
app.set("views", "./views");

//Routes
app.use("/password-mobile", passwordMobileRoute);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRoute);
app.use("/password", passwordRoute);
app.use("/api/products", productsRoute);
app.use("/api", payment);

// Global Error
app.use((err, req, res, next) => {
  const { status, message, stack } = err;
  res
    .status(status || 500)
    .json({ message, ...(process.env.NODE_ENV === "development" && { stack }) });
});

//listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is live"));
