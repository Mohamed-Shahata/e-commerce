const express = require("express");
const {
  forgotPasswordView,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetThePassword
} = require("../Controllers/passwordController");
const router = express.Router();

router.route("/forgot-password")
                .get(forgotPasswordView)
                .post(sendForgotPasswordLink)

router.route("/rest-password/:id/:token")
                                        .get(getResetPasswordView)
                                        .post(resetThePassword)


module.exports = router;