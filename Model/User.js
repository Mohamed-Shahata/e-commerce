const Joi = require("joi");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    minlenghth: 5,
    maxlenght: 40
  },
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlenghth: 1,
    maxlenght: 100
  },
  vereificationCode:{
    type: String
  },
  registed:{
    type: Boolean,
    default: false
  },
  password:{
    type: String,
    required: true,
    trim: true,
    minlenghth: 8,
    maxlenght: 20
  },
  image:{
    type: String,
    default: "default-image.png"
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  createdAt:{
    type: Date,
    default: Date.now()
  }
});

// function ValidationRegisterUser
const ValidationRegisterUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(1).max(100).required().email(),
    name: Joi.string().trim().min(5).max(40).required(),
    password: Joi.string().trim().min(8).max(50).required(),
    image: Joi.string().trim()
  });

  return schema.validate(obj);
};

// function ValidationLoginUser
const ValidationLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(1).max(100).required().email(),
    password: Joi.string().trim().min(8).max(50).required()
  });

  return schema.validate(obj);
};

// function ValidationUpdateUser
const ValidationUpdateUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(1).max(100).email(),
    name: Joi.string().trim().min(5).max(40),
    password: Joi.string().trim().min(8).max(50),
    image: Joi.string().trim()
  });

  return schema.validate(obj);
};


const User = mongoose.model("User" , UserSchema);

module.exports = { 
  User,
  ValidationRegisterUser,
  ValidationLoginUser,
  ValidationUpdateUser
};