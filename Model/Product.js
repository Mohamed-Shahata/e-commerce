const Joi = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name:{
    type: String,
    maxlenght: 50,
    minlength: 2,
    required: true,
    trim: true
  },
  description:{
    type: String,
    minlength: 2,
    maxlenght: 1000,
    required: true,
    trim: true
  },
  price:{
    type: Number,
    required: true,
    min: 0
  },
  category:{
    type: String,
    required: true,
    enum: ["tv" , "clothes" , "shoes" , "laptop" , "phone"]
  }
});

// function Validation Create Product
const ValidationCreateProduct = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    description: Joi.string().min(2).max(1000).required().trim(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required()
  })
  return schema.validate(obj);
}

// function Validation Update Product
const ValidationUpdateProduct = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    description: Joi.string().min(2).max(1000).trim(),
    price: Joi.number().min(0),
    category: Joi.string()
  })
  return schema.validate(obj);
}

const Product = mongoose.model("Product" , ProductSchema);

module.exports = {
  Product,
  ValidationCreateProduct,
  ValidationUpdateProduct
}