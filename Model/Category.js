const { Schema, Types, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Category Name already Exisit "],
      trim: true,
      maxLength: 50,
      minLength: [2, "short Category Name "],
      required: true,
    },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory", 
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category