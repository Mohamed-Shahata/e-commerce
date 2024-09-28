<<<<<<< HEAD
const Joi = require("joi");
const { Schema, Types, model } = require("mongoose");
// const { default: slugify } = require("slugify");

// const ProductSchema = new Schema({
//   name:{
//     type: String,
//     maxlenght: 50,
//     minlength: 2,
//     required: true,
//     trim: true
//   },
//   description:{
//     type: String,
//     minlength: 2,
//     maxlenght: 1000,
//     required: true,
//     trim: true
//   },
//   price:{
//     type: Number,
//     required: true,
//     min: 0
//   },
//   newPrice:{
//     type: Number,
//     min: 0
//   },
//   discount:{
//     type: Number,
//     min: 0,
//     default: 0
//   },
//   quantity:{
//     type: Number,
//     min: 1,
//     default: 1
//   },
//   offer:{
//     type: Boolean,
//     default: false
//   },
//   category:{
//     type: String,
//     required: true,
//     enum: [
//       "Clothes","Electronics","Shoes","Accessories",
//       "Furniture","Sports","Perfumes","Books","Mackup",
//       "Bags"
//     ],
//   },
//   attributes:{
//       subCategory:{
//         type: String,
//         enum:[
//           "Men","Women","Children","Men & Women",
//           "Tablets","Laptops","Phones","Headphones",
//           "Face","Eyes","Lips","Nails",
//           "Sports equipment","Sports clothing","camping tools",
//           "Novels","Educational","Children","Biography",
//           "Bedrooms","Kitchens","Offices","Living rooms"
//         ],
//       },
//       size:[
//         {
//           type: String,
//           enum:[
//             "XX-small","X-small","Small","Medium",
//             "Large","X-large","XX-large","3X-large","4X-large"
//           ],
//         },
//       ],
//       type:{
//         type: String,
//         enum:[
//           "T-shirt","Shorts","Shirts","Hoodie","Jeans",
//           "Sneakers","Oxford","Boots","Loafers","Sandals",
//           "Foundation","Mascara","Lipstick","Powder",
//           "Hand","back","shoulder","travel",
//           "Perfume","eau de toilette","eau de cologne",
//           "Paper","Electronic",
//           "Watches","glasses","jewelry","pack it",
//           "Sofas","tables","beds","cabinets"

//         ],
//       },
//       colors:[
//         {
//           type: String,
//           enum:[
//             "Red","Blue","Green","Black","White","Yellow",
//             "Orange","Heavenly","Purple","Rosy"
//           ],
//         }
//       ],
//       style:{
//         type: String,
//         enum:[
//           "Casual","Formal","Party","Gym",
//         ],
//       },
//       brand:{
//         type: String,
//         enum:[
//           "Nike","Adidas","Zara","H&M","Gucci",
//           "Polo Ralph Lauren","Levi's",
//           "Apple","Samsung","Sony","LG","Huawei","Dell","Lenovo",
//           "Puma","Converse","Clarks","Dior","Reebok",
//           "MAC","Fenty Beauty","Maybelline",
//           "L'Oreal","NYX","Dior","Bobbi Brown",
//           "Michael Kors","Louis Vuitton","Chanel",
//           "Prada","Kate Spade","Gucci","Hermes",
//           "Nike","Adidas","Reebok",
//           "The North Face","Patagonia","Columbia","Decathlon",
//           "Chanel","Dior","Clvin Klein",
//           "Giorgio","Tom Forf","Jo Malone","Loewe",
//           "Tiffany & Co","Cartier","Rolex","Pandora","Ray-Ban",
//           "Michael Kors","Swarovski",

//         ],
//       },
//       warranty:{
//         type: String,
//         enum:[
//           "1m","2m","3m","4m","5m","6m","7m","8m","9m","10m","11m",
//           "1y","2y","3y","4y","5y","6y","7y","8y","9y","10y"
//         ]
//       },
//       Skin_type:{
//         type: String,
//         enum:[
//           "Oily","dry","combination","sensitive",
//         ],
//       },
//       Activity:{
//         type: String,
//         enum:[
//           "Running","exercises","Yoga","camping"
//         ],
//       },
//       material:{
//         type: String,
//         enum:[
//           "fabric","Rubber","Metal",
//           "Gold","silver","leather"

//         ],
//       },
//       Capacity:{
//         type: String,
//         enum:[
//           "100ml","200ml","300ml","400ml","500ml","600ml"
//         ],
//       },
//       Smells:{
//         type: String,
//         enum:[
//           "Floral","woody","fruity","citrusy"
//         ],
//       },
//       language:{
//         type: String,
//         enum:[
//           "Arabic","English","French"
//         ],
//       },
//       authors:{
//         type: String,
//         enum:[
//           "Naguib Mahfouz","Ghassan Kanafani","Nizar Qabbani","Taha Hussein",
//           "Elias Khoury","Hanan Al-Shaykh","Alaa Al Aswany",
//           "Adonis (Ali Ahmad Said Esber)","Ahlam Mosteghanemi","Tayeb Salih"
//         ],
//       },

//     },
//   reviews:[
//     {
//       user:{
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },
//       averageRating:{
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5
//       },
//       text:{
//         type: String
//       }
//     }
//   ],
//   images:[
//     {
//       url:{
//         type: String,
//         required: true
//       },
//       publicId:{
//         type: String,
//         required: true
//       }
//     }
//   ],
//   createAt:{
//     type: Date,
//     default: Date.now()
//   }
// });

// function Validation Create Product
=======
import joi from "joi";
import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
>>>>>>> c3be5061bc9dc70aa8a126f29177a0fe0b44a23c

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      maxlenght: 50,
      minlength: 2,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
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
      type: Types.ObjectId,
      ref: "image",
      required: false,
    },
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
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "price after discount must not exceed the original price",
      },
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
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: false,
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    reviews: [
      {
        type: Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("images", {
  ref: "imagesOnProduct",
  localField: "_id",
  foreignField: "product_id",
});

ProductSchema.pre(/^find/, async function (next) {
  this.populate("images", "-product_id");
  this.populate("imgCover", "path");
  this.populate("createdBy", "email");
  this.populate("categoryId", "name");
  this.populate("subCategoryId", "name");

  next();
});

ProductSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

ProductSchema.pre("updateMany", function (next) {
  console.log(this._update);

  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

ProductSchema.pre(/delete/i, async function (next) {
  console.log(this._conditions);
  const productToBeDeleted = await Product.find(this._conditions);
  if (!productToBeDeleted) return next();
  // delete image doc from image model
  await model("image").findByIdAndDelete(productToBeDeleted.imgCover);

  next();
});

ProductSchema.pre(/delete/i, async function (next) {
  console.log(this._conditions);
  const productToBeDeleted = await Product.find(this._conditions);
  if (!productToBeDeleted) return next();

  await Promise.all(
    // delete images docs from image model
    productToBeDeleted.images.map(async (image) => {
      await model("imagesOnProduct").findByIdAndDelete(image._id);
    })
  );
  next();
});

ProductSchema.pre(/update/i, async function (next) {
  console.log(this._conditions);
  const productToBeDeleted = await Product.find(this._conditions);
  if (!productToBeDeleted) return next();
  // delete image doc from image model
  await model("image").findByIdAndDelete(productToBeDeleted.imgCover);

  next();
});

const ValidationCreateProduct = (obj) => {
  const schema = object({
    name: joi.string().min(2).max(50).required().trim(),
    description: joi.string().min(2).max(1000).required().trim(),
    price: joi.number().min(0).required(),
    discount: joi.number().min(0),
    quantity: joi.number().min(1),
    category: joi.string().required(),
    offer: joi.boolean(),
  });
  return schema.validate(obj);
};

// function Validation Update Product
const ValidationUpdateProduct = (obj) => {
  const schema = object({
    name: joi.string().min(2).max(50).trim(),
    description: joi.string().min(2).max(1000).trim(),
    price: joi.number().min(0),
    discount: joi.number().min(0),
    quantity: joi.number().min(1),
    category: joi.string(),
    offer: joi.boolean(),
  });
  return schema.validate(obj);
};

const Product = model("Product", ProductSchema);

export { Product, ValidationCreateProduct, ValidationUpdateProduct };
