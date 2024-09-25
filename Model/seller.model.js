import { Schema } from "mongoose";
import User from "./user.model.js";

export const sellerSchema = Schema({
  rating: Number,
  businessType: { type: String, enum: ["individual", "corporation"] },
});

const Seller = User.discriminator("seller", sellerSchema);
export { Seller };
