const express = require("express");
const { payment } = require("../Controllers/paymentController");
const router = express.Router();



router.post("/pay" , payment);

router.post("/payment/callback" , (req , res) => {
  res.send("Payment processed")
});


module.exports = router;