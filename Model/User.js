import joi from "joi";
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
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
      minlength: 1,
      maxlength: 100,
    },
    password: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
    },
    birthDate: Date,
    verificationCode: {
      type: String,
    },
    codeRestPassword: {
      type: String,
    },
    registered: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png",
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
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

// Function Validation Register User
const ValidationRegisterUser = (obj) => {
  const schema = joi.object({
    firstName: joi.string().trim().min(1).max(100).required(),
    lastName: joi.string().trim().min(1).max(100).required(),
    gender: joi.string().valid("male", "female").required(),
    email: joi
      .string()
      .email({
        maxDomainSegments: 2,
        tlds: { allow: ["com", "pro"] },
      })
      .lowercase()
      .trim()
      .min(1)
      .max(100)
      .required(),
    password: joi.string().trim().min(8).max(50).required(),
    role: joi.string().valid("admin", "client", "seller").required(),
    image: joi.string().trim(),
  });

  return schema.validate(obj);
};

// Function Validation Login User
const ValidationLoginUser = (obj) => {
  const schema = joi.object({
    email: joi.string().trim().min(1).max(100).required().email(),
    password: joi.string().trim().min(8).max(50).required(),
  });

  return schema.validate(obj);
};

// Function Validation Update User
const ValidationUpdateUser = (obj) => {
  const schema = joi.object({
    email: joi.string().trim().min(1).max(100).email(),
    image: joi.string().trim(),
  });

  return schema.validate(obj);
};

const User = model("User", UserSchema);

export {
  User,
  ValidationRegisterUser,
  ValidationLoginUser,
  ValidationUpdateUser,
};
