const { Schema, Types, model } = require("mongoose");


const reviewSchema = new Schema({
  productId: {
    type: Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  text: {
    type: String,
  },
})

const Review = model("Review",reviewSchema)

module.exports = Review