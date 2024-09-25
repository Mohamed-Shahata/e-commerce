import joi from "joi";
import { model, Schema, Types } from "mongoose";
import slugify from "slugify";

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
