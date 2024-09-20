const { Schema, Types, model } = require("mongoose");
const { default: slugify } = require("slugify");

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

brandSchema.pre("save", function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
    
  }
  next();
});

brandSchema.pre("updateMany", function (next) {
  if (this._update.name) {
    this._update.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Brand = model("Brand" , brandSchema);

module.exports = { Brand };
