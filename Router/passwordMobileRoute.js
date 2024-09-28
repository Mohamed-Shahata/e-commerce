import { Router } from "express";
import {
    sendForgotPasswordMobile,
    verifyCode,
    resetThePasswordMobile
} from "../Controllers/passwordMobileControler.js";
const router = Router();

router.route("/forgot-password")
                                .post(sendForgotPasswordMobile)
router.route("/verify-code")
                            .post(verifyCode)

router.route("/rest-password")
                            .post(resetThePasswordMobile)

export default router;