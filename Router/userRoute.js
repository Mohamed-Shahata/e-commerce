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
const router = express.Router();
const upload = require("../middlewares/uploadImage.js");


// /api/users
router.get("/" , verifyTokenAndAdmin ,  getAllUser);

// /api/users/id
router.route("/:id")
                  .get(verifyToken , getSingleUser)
                  .patch(verifyTokenAndAutherization , upload.single("image") , updateUser)
                  .delete(verifyTokenAndAutherization , deleteUser)


module.exports = router;