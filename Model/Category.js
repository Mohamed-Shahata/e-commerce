<<<<<<< HEAD
const { Schema, Types, model } = require("mongoose");
// const { default: slugify } = require("slugify");
=======
import { Schema, Types, model } from "mongoose";
import slugify from "slugify";
>>>>>>> c3be5061bc9dc70aa8a126f29177a0fe0b44a23c

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
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    image: {
      type: Types.ObjectId,
      ref: "image",
      required: false,
    },
    // subCategoryId: {
    //   type: Types.ObjectId,
    //   ref: "subCategory",
    // }, // make it virtual field (if no needed in controller)
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("subCategoryId", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "categoryId",
});

categorySchema.pre("save", function (next) {
  // If the name has been modified or it's a new document, generate the slug
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

categorySchema.pre("updateMany", function (next) {
  console.log(this._update);

  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

categorySchema.pre(/find/, function (next) {
  this.populate("image", "path");
  this.populate("createdBy", "email");

  next();
});

categorySchema.pre(/delete/i, async function (next) {
  console.log(this._conditions);
  const categoryToBeDeleted = await Category.find(this._conditions);
  if (!categoryToBeDeleted) return next();
  // delete image doc from image model
  await model("image").findByIdAndDelete(categoryToBeDeleted.image);

  next();
});

categorySchema.pre(/update/i, async function (next) {
  if (!this._update.image) return next();

  console.log(this._conditions);
  const categoryToBeUpdated = await Category.find(this._conditions);
  if (!categoryToBeUpdated) return next();
  // delete image doc from image model
  await model("image").findByIdAndDelete(categoryToBeUpdated.image);

  next();
});

const Category = model("Category", categorySchema);

export { Category };
