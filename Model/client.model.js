import { Schema, Types } from "mongoose";
import { User } from "./User.js";

const clientSchema = Schema({
  products: [
    {
      type: Types.ObjectId,
      ref: "Product",
      required: false,
    },
  ],
  address: String,
  phone: String,
});

const Client = User.discriminator("client", clientSchema);
export { Client };
