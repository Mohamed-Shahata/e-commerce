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
  offer:{
    type: Boolean,
    default: false
  },
  category:{
    type: String,
    required: true,
    enum: [
      "Clothes","Electronics","Shoes","Accessories",
      "Furniture","Sports","Perfumes","Books","Mackup",
      "Bags"
    ],
    
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

const clothesSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Men","Women","Children"
    ],
  },
  size:[
    {
      type: String,
      enum:[
        "XX-small","X-small","Small","Medium",
        "Large","X-large","XX-large","3X-large","4X-large"
      ],
    },
  ],
  type:{
    type: String,
    enum:[
      "T-shirt","Shorts","Shirts","Hoodie","Jeans"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
        "Orange","Heavenly","Purple","Rosy"
      ],
    }
  ],
  style:{
    type: String,
    enum:[
      "Casual","Formal","Party","Gym",
    ],
  },
  brand:{
    type: String,
    enum:[
      "Nike","Adidas","Zara","H&M","Gucci",
      "Polo Ralph Lauren","Levi's"
    ],
  }
});

const electronicsSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Tablets","Laptops","Phones","Headphones"
    ],
  },
  brand:{
    type: String,
    enum:[
      "Apple","Samsung","Sony","LG","Huawei","Dell","Lenovo"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
      ],
    }
  ],
  warranty:{
    type: String,
    enum:[
      "1m","2m","3m","4m","5m","6m","7m","8m","9m","10m","11m",
      "1y","2y","3y","4y","5y","6y","7y","8y","9y","10y"
    ]
  }
});

const shoesSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Men","Women","Children"
    ],
  },
  size:[
    {
      type: String,
      enum:[
        "XX-small","X-small","Small","Medium",
        "Large","X-large","XX-large","3X-large","4X-large"
      ],
    },
  ],
  type:{
    type: String,
    enum:[
      "Sneakers","Oxford","Boots","Loafers","Sandals"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
        "Orange","Heavenly","Purple","Rosy"
      ],
    }
  ],
  style:{
    type: String,
    enum:[
      "Casual","Formal","Party","Gym",
    ],
  },
  brand:{
    type: String,
    enum:[
      "Nike","Puma","Converse","Clarks","Dior","Adidas","Reebok"
    ],
  }
});

const makeupSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Face","Eyes","Lips","Nails"
    ],
  },
  type:{
    type: String,
    enum:[
      "Foundation","Mascara","Lipstick","Powder"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
        "Orange","Heavenly","Purple","Rosy"
      ],
    }
  ],
  brand:{
    type: String,
    enum:[
      "MAC","Fenty Beauty","Maybelline",
      "L'Oreal","NYX","Dior","Bobbi Brown"
    ],
  },
  Skin_type:{
    type: String,
    enum:[
      "Oily","dry","combination","sensitive",
    ],
  }
});

const bagsSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Men","Women","Children"
    ],
  },
  type:{
    type: String,
    enum:[
      "Hand","back","shoulder","travel"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
        "Orange","Heavenly","Purple","Rosy"
      ],
    }
  ],
  brand:{
    type: String,
    enum:[
      "Michael Kors","Louis Vuitton","Chanel",
      "Prada","Kate Spade","Gucci","Hermes"
    ],
  },
});

const sportsSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Sports equipment","Sports clothing","camping tools"
    ],
  },
  Activity:{
    type: String,
    enum:[
      "Running","exercises","Yoga","camping"
    ],
  },
  material:{
    type: String,
    enum:[
      "fabric","Rubber","Metal"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
        "Orange","Heavenly","Purple","Rosy"
      ],
    }
  ],
  brand:{
    type: String,
    enum:[
      "Nike","Adidas","Reebok",
      "The North Face","Patagonia","Columbia","Decathlon"
    ],
  },
});

const perfumesSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Men","Women","Men & Women"
    ],
  },
  type:{
    type: String,
    enum:[
      "Perfume","eau de toilette","eau de cologne"
    ],
  },
  Capacity:{
    type: String,
    enum:[
      "100ml","200ml","300ml","400ml","500ml","600ml"
    ],
  },
  Smells:{
    type: String,
    enum:[
      "Floral","woody","fruity","citrusy"
    ],
  },
  brand:{
    type: String,
    enum:[
      "Chanel","Dior","Clvin Klein",
      "Giorgio","Tom Forf","Jo Malone","Loewe"
    ],
  },
});

const booksSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Novels","Educational","Children","Biography"
    ],
  },
  language:{
    type: String,
    enum:[
      "Arabic","English","French"
    ],
  },
  authors:{
    type: String,
    enum:[
      "Naguib Mahfouz","Ghassan Kanafani","Nizar Qabbani","Taha Hussein",
      "Elias Khoury","Hanan Al-Shaykh","Alaa Al Aswany",
      "Adonis (Ali Ahmad Said Esber)","Ahlam Mosteghanemi","Tayeb Salih"
    ],
  },
  type:{
    type: String,
    enum:[
      "Paper","Electronic"
    ],
  },
});

const accessoriesSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Men","Women","Children"
    ],
  },
  brand:{
    type: String,
    enum:[
      "Tiffany & Co","Cartier","Rolex","Pandora","Ray-Ban",
      "Michael Kors","Swarovski"
    ],
  },
  material:{
    type: String,
    enum:[
      "Gold","silver","leather","fabric"
    ],
  },
  type:{
    type: String,
    enum:[
      "Watches","glasses","jewelry","pack it"
    ],
  },
});

const furnitureSchema = new mongoose.Schema({
  subCategory:{
    type: String,
    enum:[
      "Bedrooms","Kitchens","Offices","Living rooms"
    ],
  },
  colors:[
    {
      type: String,
      enum:[
        "Red","Blue","Green","Black","White","Yellow",
        "Orange","Heavenly","Purple","Rosy"
      ],
    }
  ],
  size:{
    type: String,
    enum:[
      "Small","medium","large"
    ],
  },
  type:{
    type: String,
    enum:[
      "Sofas","tables","beds","cabinets"
    ],
  },
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
const Clothes = Product.discriminator("Clothes", clothesSchema);
const Electronics = Product.discriminator("Electronics", electronicsSchema);
const Shoes = Product.discriminator("Shoes", shoesSchema);
const Makeup = Product.discriminator("Makeup", makeupSchema);
const Bags = Product.discriminator("Bags", bagsSchema);
const Sports = Product.discriminator("Sports", sportsSchema);
const Perfumes = Product.discriminator("Perfumes", perfumesSchema);
const Books = Product.discriminator("Books", booksSchema);
const Accessories = Product.discriminator("Accessories", accessoriesSchema);
const Furniture = Product.discriminator("Furniture", furnitureSchema);

module.exports = {
  Product,
  Clothes,
  Electronics,
  Shoes,
  Makeup,
  Bags,
  Sports,
  Perfumes,
  Books,
  Accessories,
  Furniture,
  ValidationCreateProduct,
  ValidationUpdateProduct
}