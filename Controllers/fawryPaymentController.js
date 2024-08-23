const axios = require("axios");

const fawryPayment = async(req , res) => {
  const { customerName , customerEmail , customerPhone , amount } = req.body;
  try {
    
    const paymentData = {
      merchantCode: "",
      merchantRefNum: "ORDER_12345",
      customerProfileId: "",
      customerMobile: customerPhone,
      customerEmail: customerEmail,
      paymentMethod: "PAYATFAWRY",
      amount: amount,
      currencyCode: "EGP",
      description: "Payment for Order 12345",
      chargeItems:[
        {
          itemId: "ITEM_ID_1",
          description: "Product 1",
          price: amount,
          quantity: 1
        }
      ]
    };
    const API_KEY = "https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge";
    const response = await axios.post(API_KEY , paymentData , {
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SECRET_API_KEY'
      }
    })

    res.json({ paymentLink: response.data.paymentLink });
  } catch (err) {
    console.log("error fawryPayment: " , err)
    res.status(500).json({error: "Server error"});
  }
}

module.exports = {
  fawryPayment
}