const { Schema, Types, model } = require("mongoose");
const mongoose = require("mongoose");

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "SubCategory Name already Exisit "],
      trim: true,
      maxLength: 50,
      minLength: [2, "short SubCategory Name "],
      required: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SubCategory = model("SubCategory", subCategorySchema);

module.exports = { SubCategory };
