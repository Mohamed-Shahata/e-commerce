import { Router } from "express";
import {
  sendForgotPasswordLink,
  resetThePassword,
} from "../Controllers/passwordController.js";
const router = Router();

router.route("/forgot-password").post(sendForgotPasswordLink);

router.route("/rest-password/:id/:token").post(resetThePassword);

<<<<<<< HEAD
module.exports = router;
=======
export default router;
>>>>>>> c3be5061bc9dc70aa8a126f29177a0fe0b44a23c
