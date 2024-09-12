const Joi = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlenght: 50,
      minlength: 2,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minlength: 2,
      maxlenght: 1000,
      required: true,
      trim: true,
    },
    imgCover: {
      id: { type: String, unique: true, required: true },
      url: { type: String, required: true },
    },
    images: [
      {
        publicId: { type: String, unique: true, required: true },
        url: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    newPrice: {
      type: Number,
      min: 0,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type" },
    skinType: { type: mongoose.Schema.Types.ObjectId, ref: "SkinType" }, //?
    activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // ?
    smell: { type: mongoose.Schema.Types.ObjectId, ref: "Smells" }, // berfums
    language: { type: mongoose.Schema.Types.ObjectId, ref: "Language" }, //book
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" }, // book

    specifications: {
      size: { type: String },
      color: { type: String },
    },
    warranty: { type: String },
    material: { type: String },
    capacity: { type: String },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        averageRating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        text: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const ValidationCreateProduct = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    description: Joi.string().min(2).max(1000).required().trim(),
    price: Joi.number().min(0).required(),
    discount: Joi.number().min(0),
    quantity: Joi.number().min(1),
    category: Joi.string().required(),
    offer: Joi.boolean()
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
    offer: Joi.boolean()
  })
  return schema.validate(obj);
}

const Product = mongoose.model("Product" , ProductSchema);

module.exports = {
  Product,
  ValidationCreateProduct,
  ValidationUpdateProduct
}