import { paymob } from "../config/paymob.js";

async function getToken() {
  try {
    const response = await post(`${process.env.PAYMOB_API_URL}/auth/tokens`, {
      api_key: process.env.PAYMOB_API_KEY,
    });
    return response.data.token;
  } catch (err) {
    console.log("Error from getToken: ", err);
    throw err;
  }
}

async function createPayment(amount, orderId) {
  try {
    const token = await getToken();
    const response = await post(
      "/ecommerce/orders",
      {
        amount_cents: amount * 100,
        currency: "EGP",
        merchant_order_id: orderId,
        payment_method: "paymob",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Error from createPayment: ", err);
    throw err;
  }
}

export { createPayment };
