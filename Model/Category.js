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
      url: String,
      publicId: String,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "subCategory", // or enum
    },// make it virtual field (if no needed in controller)
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);