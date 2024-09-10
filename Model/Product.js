const Joi = require("joi");
const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
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
//         type: mongoose.Schema.Types.ObjectId,
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
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brandId: {
      type: Types.ObjectId,
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