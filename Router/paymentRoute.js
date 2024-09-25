import { Router } from "express";
import { payment } from "../Controllers/paymentController.js";
const router = Router();

router.post("/pay", payment);

router.post("/payment/callback", (req, res) => {
  res.send("Payment processed");
});

export default router;
