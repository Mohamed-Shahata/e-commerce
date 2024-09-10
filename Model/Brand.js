const { Schema, model } = require("mongoose");

const brandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [2, "short Brand Name "],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true, strictQuery: true } // filter only with this schema fields
);

const Brand = model("Brand" , brandSchema);

module.exports = { Brand };
