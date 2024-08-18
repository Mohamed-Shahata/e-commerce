const {
  User,
  ValidationRegisterUser,
  ValidationLoginUser
} = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationCode } = require("../utils/sendEmail.js");


/**
 * @description Register Controller View
 * @route       /api/auth/register
 * @method      GET
 * @access      public
 */
const registerControllerView = async(req , res) => {
  try {
    res.render("register/register");
  } catch (err) {
    console.log("Error from registerControllerView: " , err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @description Register
 * @route       /api/auth/register
 * @method      POST
 * @access      public
 */
const registerController = async(req , res) => {
  const { error } = ValidationRegisterUser(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }
    const { name , email , password } = req.body;
    const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
  try {
    let user = await User.findOne({ email }).select("-password");
    if(user){
      return res.status(400).json({message: "User already exsist"});
    };

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password , salt);

    user = new User({
      name,
      password: hashPassword,
      email,
      vereificationCode
    });
    await user.save();
    await sendVerificationCode(email , vereificationCode);
    res.render("register/email_code", { email });
  } catch (err) {
    console.log("Error from register: " , err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @description Verify Email Code
 * @route       /api/auth/verify
 * @method      POST
 * @access      public
 */
const verifyEmail = async(req , res) => {
  const { email , code } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    if(user.vereificationCode !== code){
      return res.status(400).json({message: "Invalid verifaction code"});
    }

    user.registed = true;
    user.vereificationCode = null;
    user.save();
    res.render("register/email_code_seccess");
  
  } catch (err) {
    console.log("Error from verifyEmail: " , err);
    if(!res.headersSent){
      res.status(500).json({error: "Internal server error"});
    }
    res.status(500).json({ error: "Server error" });
  }
};

// const sendNewCode = async() => {
//   const { email , code } = req.body;
//   const newVereificationCode =  Math.floor(10000 + Math.random() * 900000).toString();
//   const user = await User.findOne({ email });
//   if(!user){
//     return res.status(404).json({message: "User not found"});
//   };

//   user.vereificationCode = newVereificationCode;
//   await user.save();

//   await sendVerificationCode(email , newVereificationCode);

//   if(user.vereificationCode !== code){
//     return res.status(400).json({message: "Invalid verifaction code"});
//   };

//   user.registed = true;
//   user.vereificationCode = null;
//   user.save();

//   const token = await jwt.sign({
//     id: user._id,
//     isAdmin: user.isAdmin
//   }, process.env.JWT_SECRET_KEY , { expiresIn: "1d" });
//   res.status(200).json({message: "Account verified successfully" , user , token})
// }

/**
 * @description Login 
 * @route       /api/auth/login
 * @method      POST
 * @access      public
 */
const loginController = async(req , res) => {
  const { error } = ValidationLoginUser(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }

  const { email , password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({message: "User not found"});
    };
    if(user.registed === false){
      return res.status(400).json({message: "Complete creating your account"})
    }
    const comparePassword = await bcryptjs.compare(password , user.password);

    if(email !== user.email){
      return res.status(400).json({message: "email or password is wrong"});
    }
    if(comparePassword == false){
      return res.status(400).json({message: "email or password is wrong"});
    }
    const token = await jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    } , process.env.JWT_SECRET_KEY , {expiresIn: "1d"});

    res.status(200).json({message: "Login user successfully" , user , token});
  } catch (err) {
    console.log("Error from Login: " , err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  registerControllerView,
  verifyEmail,
};