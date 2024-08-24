const { createPayment } = require("../utils/paymobUtils");

const payment = async (req ,res) => {
  const { amount , orderId } = req.body;
  try {
    const paymentDetails = await createPayment(amount , orderId);
    res.redirect(paymentDetails.payment_url);
  } catch (err) {
    console.log("Error from deleteUser: ", err);
    res.status(500).json({error: "Server error"});
  }
};


module.exports = {
  payment
}