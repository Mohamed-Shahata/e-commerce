const express = require("express");
const {
  sendForgotPasswordLink,
  resetThePassword
} = require("../Controllers/passwordController");
const router = express.Router();

router.route("/forgot-password")
                .post(sendForgotPasswordLink)

router.route("/rest-password/:id/:token")
                                        .post(resetThePassword)

module.exports = router;