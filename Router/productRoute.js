const express = require("express");
const {
  verifyToken,
  verifyTokenAndAdmin
  } = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadImage");
const {
  createProduct,
  updateProduct,
  deleteproduct,
  getAllProducts,
  getSingleProducts,
  reviewProduct,
  updateReviewProduct,
  deleteReviewProduct
} = require("../Controllers/productController");
const router = express.Router();


router.route("/")
                .get( getAllProducts )
                .post(verifyToken , upload.array("images") , createProduct )

router.route("/:id")
                  .get(verifyToken , getSingleProducts)
                  .put(verifyTokenAndAdmin , upload.array("images") , updateProduct)
                  .delete(verifyTokenAndAdmin , deleteproduct)

router.route("/:id/review")
                          .post(verifyToken , reviewProduct)
                          .put(verifyToken , updateReviewProduct)
                          .delete(verifyToken , deleteReviewProduct)


module.exports = router;