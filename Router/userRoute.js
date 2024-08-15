const express = require("express");
const {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
} = require("../Controllers/userController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAutherization
} = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadImage.js");
const router = express.Router();


// /api/users
router.get("/" , verifyTokenAndAdmin ,  getAllUser);

// /api/users/id
router.route("/:id")
                  .get(verifyToken , getSingleUser)
                  .put(verifyTokenAndAutherization , upload.single("image") , updateUser)
                  .delete(verifyTokenAndAutherization , deleteUser)


module.exports = router;