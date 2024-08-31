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
  newPrice:{
    type: Number,
    min: 0
  },
  discount:{
    type: Number,
    min: 0,
    default: 0
  },
  quantity:{
    type: Number,
    min: 1,
    default: 1
  },
  category:{
    type: String,
    required: true,
    enum: [
      "Clothes","Mackup","Bags","Shoes","Accessories","Electronics",
      "kids'Toys","Video Games","Furniture","Car Accessories",
      "Cleaning Products","Personal Care Products","School Supplies",
      "Pet Supplies","Arts & Crafts","Travel & Luggage","Tech & Gadgets",
      "Sports & Outdoors","Perfumes","Books"
    ]
  },
  reviews:[
    {
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      averageRating:{
        type: Number,
        default: 0,
        min: 0,
        max: 5
      }
    }
  ],
  images:[
    {
      url:{
        type: String,
        required: true
      },
      publicId:{
        type: String,
        required: true
      }
    }
  ],
  createAt:{
    type: Date,
    default: Date.now()
  }
});

// function Validation Create Product
const ValidationCreateProduct = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    description: Joi.string().min(2).max(1000).required().trim(),
    price: Joi.number().min(0).required(),
    discount: Joi.number().min(0),
    quantity: Joi.number().min(1),
    category: Joi.string().required(),
  })
  return schema.validate(obj);
}

// function Validation Update Product
const ValidationUpdateProduct = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    description: Joi.string().min(2).max(1000).trim(),
    price: Joi.number().min(0),
    discount: Joi.number().min(0),
    quantity: Joi.number().min(1),
    category: Joi.string(),
  })
  return schema.validate(obj);
}

const Product = mongoose.model("Product" , ProductSchema);

module.exports = {
  Product,
  ValidationCreateProduct,
  ValidationUpdateProduct
}