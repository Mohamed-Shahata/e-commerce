import { model, Schema, Types } from "mongoose";

const imagesOnProductSchema = new Schema(
  {
    image_id: {
      type: Types.ObjectId,
      ref: "image",
      required: false,
    },
    product_id: {
      type: Types.ObjectId,
      ref: "Product",
      required: false,
    },
  },
  { timestamps: true }
);

imagesOnProductSchema.pre(/^find/, function (next) {
  this.populate("image_id");

  next();
});

imagesOnProductSchema.pre(/delete/i, async function (next) {
  const imagesOnProductToBeDeleted = await imagesOnProduct.find(
    this._conditions
  );
  if (!imagesOnProductToBeDeleted) return next();

  // delete image docs from public image model
  await model("image").findByIdAndDelete(
    imagesOnProductToBeDeleted.image_id._id
  );

  next();
});

const imagesOnProduct = model("imagesOnProduct", imagesOnProductSchema);

export { imagesOnProduct };
