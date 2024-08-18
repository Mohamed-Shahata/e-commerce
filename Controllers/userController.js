const { User, ValidationUpdateUser } = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const fs = require("fs");

/**
 * @description Get All Users
 * @route       /api/users
 * @method      Get
 * @access      private
 */
const getAllUser = async(req , res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users })
  } catch (err) {
    console.log("Error from getAllUser: ", err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Get Single User
 * @route       /api/users
 * @method      Get
 * @access      public
 */
const getSingleUser = async(req , res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");

    if(!user){
      return res.status(404).json({message: "User not found"});
    };

    res.status(200).json({ user })
  } catch (err) {
    console.log("Error from getSingleUser: ", err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Update User
 * @route       /api/users
 * @method      PUT
 * @access      public
 */
const updateUser = async(req , res) => {

  const { error } = ValidationUpdateUser(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }

  const id = req.params.id;
  const { name , password , email } = req.body;


  try {
    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    const image = req.file ? req.file.path : user.image;

    let hashPassword = user.password;
    if(password){
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password , salt);
    }


    const userUpdate = await User.findByIdAndUpdate(user._id , {$set:{
      name: name || user.name,
      password: hashPassword,
      email: email || user.email,
      image: image || user.image,
    }} , { new : true }).select("-password");


    res.status(200).json({message: "Updated user successfully" , user: userUpdate});
  } catch (err) {
    console.log("Error from updateUser: ", err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Delete User
 * @route       /api/users
 * @method      DELETE
 * @access      public
 */
const deleteUser = async(req , res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);

    if(!user){
      return res.status(404).json({message: "User not found"});
    };

    //delete image user
    fs.unlink(user.image , (err) => {
      if(err){
        return res.status(400).json({message: "faild to delete image file"})
      }
    })

    res.status(200).json({message: "deleted user successfully"});
  } catch (err) {
    console.log("Error from deleteUser: ", err);
    res.status(500).json({error: "Server error"});
  }
};

module.exports = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
};