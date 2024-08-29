const {
  User,
  ValidationRegisterUser,
  ValidationLoginUser
} = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationCode } = require("../utils/sendEmail.js");


/**
 * @description Register
 * @route       /api/auth/register
 * @method      POST
 * @access      public
 */
const registerController = async(req , res) => {
  const { firstName , lastName , email , password , confirmPassword } = req.body;
  const { error } = ValidationRegisterUser({firstName , lastName , email , password});
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }
    const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
  try {
    let user = await User.findOne({ email }).select("-password");


    if(user && user.registed === true){
      return res.status(400).json({message: "User already exsist"});
    }else if(user && user.registed === false){

      if(confirmPassword !== password){
        return res.status(401).json({message: "The password is not the same"})
      }
      const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
      user.vereificationCode = vereificationCode;
      await user.save();
      await sendVerificationCode(email , vereificationCode);
      return res.status(401).json({message: "The code is worng"});
    }else{

      if(confirmPassword !== password){
        return res.status(401).json({message: "The password is not the same"})
      }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password , salt);

    user = new User({
      firstName,
      lastName,
      password: hashPassword,
      email,
      vereificationCode
    });
    await user.save();
    await sendVerificationCode(email , vereificationCode);

    res.status(200).json({ email });
  }
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
      return res.status(401).json({message: "The code is worng"})
    }

    user.registed = true;
    user.vereificationCode = null;
    user.save();

    const token = await jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    } , process.env.JWT_SECRET_KEY , {expiresIn: "1d"});

    return res.status(401).json({message: "verify successfully" , user , token})
  
  } catch (err) {
    console.log("Error from verifyEmail: " , err);
    if(!res.headersSent){
      res.status(500).json({error: "Internal server error"});
    }
    res.status(500).json({ error: "Server error" });
  }
};

// const sendNewCode = async() => {
//   const { email } = req.body;
//   const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
//   try {
//     const user = await User.findOne({ email });
//     user.vereificationCode = vereificationCode;
//     await user.save();
//     await sendVerificationCode(email , vereificationCode);
//     res.render("register/new_code" , { email });
//   } catch (err) {
//     console.log("Error from sendNewCode: " , err);
//     res.status(500).json({ error: "Server error" });
//   }
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
      return res.status(401).json({message: "email or password is worng"})
    }
    if(comparePassword == false){
      return res.status(401).json({message: "email or password is worng"})
    }
    const token = await jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    } , process.env.JWT_SECRET_KEY , {expiresIn: "1d"});

    res.status(200).json({message: "login successfully" , user , token})
  } catch (err) {
    console.log("Error from Login: " , err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  verifyEmail,
};