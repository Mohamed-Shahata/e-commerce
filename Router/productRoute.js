const express = require("express");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadImage");
const {
  createProduct
} = require("../Controllers/productController");
const router = express.Router();


router.route("/")
                  .get(verifyToken , )
                  .post(verifyTokenAndAdmin , upload.array("images") , createProduct )

router.route("/:id")
                  .get(verifyToken , )
                  .patch(verifyTokenAndAdmin , upload.array("images") , )
                  .delete(verifyTokenAndAdmin , )




module.exports = router;