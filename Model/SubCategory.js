const { Schema, Types, model } = require("mongoose");

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
      type: Types.ObjectId,
      ref: "Category", 
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SubCategory = model("SubCategory", subCategorySchema);

module.exports = { SubCategory };
