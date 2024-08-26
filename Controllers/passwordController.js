const { User } = require("../Model/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");

/**
 * @description Forgot Password View
 * @route       /password/forgot-password
 * @method      GET
 * @access      public
 */
const forgotPasswordView = (req , res) => {
  try {
    res.send("This page forgot password")
  } catch (err) {
    console.log("error forgotPasswordView: " , err)
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Send Forgot Password Link
 * @route       /password/forgot-password
 * @method      POST
 * @access      public
 */
const sendForgotPasswordLink = async(req , res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({message: "User not found"});
    };

    if(user.registed === false){
      return res.status(400).json({message: "Complete creating your account"})
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
  try {

    const token = await jwt.sign({
      id: user._id,
      email: user.email
    }, secret , {expiresIn: "10m"});

    const PORT = process.env.PORT;
    const link = `http://localhost:${PORT || 3000}/password/rest-password/${user._id}/${token}`;

    const trnasporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_USER_EMAIL
      }
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Rest Password",
      html:`
      <div>
        <h2>Click on the button below to reset your password</h2>
        <p>${link}</p>
      </div>
      `
    };

    trnasporter.sendMail(mailOptions , (error , success) => {
      if(error){
        console.log(error);
        return Error("error trnasporter");
      }else{
        console.log("Email send:" + success.response);
      }
    });

    res.send("This page forgot password")

  } catch (err) {
    console.log("error sendForgotPasswordLink: " , err)
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Rest Password View
 * @route       /password/rest-password/:id/:token
 * @method      GET
 * @access      public
 */
// 
const getResetPasswordView = async(req , res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if(!user){
    return res.status(404).json({message: "User not found"});
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token , secret);
    res.send("This page forgot password")
  } catch (err) {
    console.log("error getResetPasswordView: " , err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Rest Password
 * @route       /password/rest-password/:id/:token
 * @method      POST
 * @access      public
 */
// 
const resetThePassword = async(req , res) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({message: "User not found"});
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token , secret);
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(req.body.password , salt);
    await user.save();

    res.send("This page forgot password")
  } catch (err) {
    console.log("error resetThePassword: " , err);
    res.status(500).json({error: "Server error"});
  }
};


module.exports = {
  forgotPasswordView,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetThePassword
};