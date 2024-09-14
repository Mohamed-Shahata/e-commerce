const { Schema, Types, model } = require("mongoose");
const { default: slugify } = require("slugify");

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

categorySchema.pre("save", function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
    
  }
  next();
});

categorySchema.pre("updateMany", function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Category = model("Category", categorySchema);

module.exports = Category;
