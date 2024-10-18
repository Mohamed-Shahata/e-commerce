import express from "express";
import { verifyToken , verifyTokenAndAdmin } from "../middlewares/verifyToken.js";
import upload from "../middlewares/uploadImage.js";
import { 
  createProduct,
  updateProduct,
  deleteproduct,
  getAllProducts,
  getSingleProducts,
  reviewProduct,
  updateReviewProduct,
  deleteReviewProduct
 } from "../Controllers/productController.js";
 const router = express.Router();


router.route("/")
                .get( getAllProducts )
                .post(verifyTokenAndAdmin , upload.array("images") , createProduct )

router.route("/:id")
                  .get(verifyToken , getSingleProducts)
                  .put(verifyTokenAndAdmin , upload.array("images") , updateProduct)
                  .delete(verifyTokenAndAdmin , deleteproduct)

router.route("/:id/review")
                          .post(verifyToken , reviewProduct)
                          .put(verifyToken , updateReviewProduct)
                          .delete(verifyToken , deleteReviewProduct)


export {router as productsRoute} ;