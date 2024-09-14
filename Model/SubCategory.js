const { Schema, Types, model } = require("mongoose");
const { default: slugify } = require("slugify");

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
      url: { type: String, required: true },
      id: { type: String, required: true },
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
  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

subCategorySchema.pre("updateMany", function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

const SubCategory = model("SubCategory", subCategorySchema);

module.exports = { SubCategory };
