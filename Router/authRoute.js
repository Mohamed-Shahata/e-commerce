const express = require("express");
const {
  registerController,
  loginController,
  registerControllerView,
  verifyEmail,
} = require("../Controllers/authController");
const router = express.Router();


router.route("/register")
                        .get(registerControllerView)
                        .post(registerController)

router.route("/verify")
                      .post(verifyEmail);

router.post("/login" , loginController);


module.exports = router;