import { Router } from "express";
import { addFavorite, getFavorite, removerFavorite } from "../Controllers/favoritesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/add" , verifyToken , addFavorite);

router.delete("/get" , verifyToken , getFavorite );

router.delete("/remove" , verifyToken , removerFavorite );

export  { router as favoritesRoute };