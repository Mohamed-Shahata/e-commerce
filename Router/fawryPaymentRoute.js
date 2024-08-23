const express = require("express");
const router = express.Router();
const { fawryPayment } = require("../Controllers/fawryPaymentController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");


router.post("/" , verifyToken , fawryPayment);


module.exports = router;