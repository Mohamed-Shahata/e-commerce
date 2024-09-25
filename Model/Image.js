import { model, Schema } from "mongoose";
import { deleteImage } from "../utils/cloudinary.Images.js";

const imageSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    path: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

imageSchema.pre(/delete/i, async function (next) {
  const imageToBeDeleted = await image.find(this._conditions)
  if (!imageToBeDeleted) return next()
  // delete image from cloudinary
  await deleteImage(imageToBeDeleted.name);
  next();
});

const image = model("image", imageSchema);

export { image };
