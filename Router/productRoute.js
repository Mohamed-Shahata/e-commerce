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
  getSingleProducts
} = require("../Controllers/productController");
const router = express.Router();


router.route("/")
                  .get(verifyToken , getAllProducts)
                  .post(verifyToken , upload.array("images") , createProduct )

router.route("/:id")
                  .get(verifyToken , getSingleProducts)
                  .put(verifyTokenAndAdmin , upload.array("images") , updateProduct)
                  .delete(verifyTokenAndAdmin , deleteproduct)


module.exports = router;