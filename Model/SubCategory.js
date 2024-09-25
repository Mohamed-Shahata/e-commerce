import { Schema, Types, model } from "mongoose";
import slugify from "slugify";

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
    categoryId: {
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

subCategorySchema.pre("save", function (next) {
  // If the name has been modified or it's a new document, generate the slug
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

subCategorySchema.pre("updateMany", function (next) {
  console.log(this._update);

  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

subCategorySchema.pre(/find/, function (next) {
  this.populate("image", "path");
  this.populate("createdBy", "email");
  this.populate("categoryId", "name");

  next();
});

subCategorySchema.pre(/delete/i, async function (next) {
  console.log(this._conditions);
  const subCategoryToBeDeleted = await SubCategory.find(this._conditions);
  if (!subCategoryToBeDeleted) return next();
  // delete image doc from image model
  await model("image").findByIdAndDelete(subCategoryToBeDeleted.image);

  next();
});

subCategorySchema.pre(/update/i, async function (next) {
  if (!this._update.image) return next();

  console.log(this._conditions);
  const subCategoryToBeUpdated = await SubCategory.find(this._conditions);
  if (!subCategoryToBeUpdated) return next();
  // delete image doc from image model
  await model("image").findByIdAndDelete(subCategoryToBeUpdated.image);

  next();
});

const SubCategory = model("SubCategory", subCategorySchema);

export { SubCategory };
