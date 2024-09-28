import { createPayment } from "../utils/paymobUtils.js";


const payment = async (req, res) => {
  const { amount, orderId } = req.body;
  try {
    const paymentDetails = await createPayment(amount, orderId);
    res.redirect(paymentDetails.payment_url);
  } catch (err) {
    console.log("Error from deleteUser: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  payment,
};
