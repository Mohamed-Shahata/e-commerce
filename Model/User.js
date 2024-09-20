const Joi = require("joi");
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlenghth: 1,
    maxlenght: 100,
  },
  gender: {
    type: String,
  },
  vereificationCode: {
    type: String,
  },
  registed: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default:
      "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png",
  },
  imagePublicId: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// function Validation Register User
const ValidationRegisterUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(1).max(100).required().email(),
    image: Joi.string().trim(),
  });

  return schema.validate(obj);
};

// function Validation Login User
const ValidationLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(1).max(100).required().email(),
    password: Joi.string().trim().min(8).max(50).required(),
  });

  return schema.validate(obj);
};

// function Validation Update User
const ValidationUpdateUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(1).max(100).email(),
    image: Joi.string().trim(),
  });

  return schema.validate(obj);
};

const User = model("User", UserSchema);

module.exports = {
  User,
  ValidationRegisterUser,
  ValidationLoginUser,
  ValidationUpdateUser,
};
