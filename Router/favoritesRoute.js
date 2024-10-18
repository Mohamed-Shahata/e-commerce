import { Router } from "express";
import { addFavorite, getFavorite, removerFavorite } from "../Controllers/favoritesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/add" , verifyToken , addFavorite);

router.get("/:userId" , verifyToken , getFavorite );

router.delete("/remove" , verifyToken , removerFavorite );

export  { router as favoritesRoute };