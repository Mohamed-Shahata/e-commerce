const axios = require("axios");
require("dotenv").config();

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_API_URL =process.env.PAYMOB_API_URL;

const paymob = axios.create({
  baseURL: PAYMOB_API_URL,
  headers:{
    "Authorization": `Bearer ${PAYMOB_API_KEY}`,
    "Content-Type" : "application/json"
  }
});

module.exports = paymob;