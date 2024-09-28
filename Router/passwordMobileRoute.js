const express = require("express");
const {
    sendForgotPasswordMobile,
    verifyCode,
    resetThePasswordMobile
} = require("../Controllers/passwordMobileControler.js");
const router = express.Router();

router.route("/forgot-password")
                                .post(sendForgotPasswordMobile)
router.route("/verify-code")
                            .post(verifyCode)

router.route("/rest-password")
                            .post(resetThePasswordMobile)

module.exports = router;