import { Router } from "express";
import {
  sendForgotPasswordLink,
  resetThePassword,
} from "../Controllers/passwordController.js";
const router = Router();

router.route("/forgot-password").post(sendForgotPasswordLink);

router.route("/rest-password/:id/:token").post(resetThePassword);

export default router;
