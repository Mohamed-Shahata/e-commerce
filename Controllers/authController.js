const {
  User,
  ValidationRegisterUser,
  ValidationLoginUser
} = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationCode } = require("../utils/sendEmail.js");
const { createToken, refreshToken } = require("../config/jwt.js");


/**
 * @description Register
 * @route       /api/auth/register
 * @method      POST
 * @access      public
 */
const registerController = async(req , res) => {
  const { firstName , lastName , email , password , gender } = req.body;
  const { error } = ValidationRegisterUser({ email });
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }
    const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
  try {
    let user = await User.findOne({ email });

    if(user){
      return res.status(400).json({message: "User already exists"})
    }

    if(user && user.registed === true){
      return res.status(400).json({message: "User already exsist"});
    }else if(user && user.registed === false){

      const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
      user.vereificationCode = vereificationCode;
      await user.save();
      await sendVerificationCode(email , vereificationCode);
      return res.status(401).json({message: "The code is worng"});
    }else{

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password , salt);

    user = new User({
      firstName,
      lastName,
      password: hashPassword,
      email,
      vereificationCode,
      gender
    });
    await user.save();
    await sendVerificationCode(email , vereificationCode);

    res.status(200).json({ message: "Check your email" , email });
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
    const user = await User.findOne({ email })
    .select("-refreshToken").select("-password");
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    if(user.vereificationCode !== code){
      return res.status(401).json({message: "The code is worng"})
    }

    const accessToken = createToken(user);
    const createRefreshToken = refreshToken(user);

    user.registed = true;
    user.vereificationCode = null;

    user.refreshToken = createRefreshToken;
    await user.save();

    return res.status(200).json({message: "verify successfully" , user , accessToken , createRefreshToken})
  
  } catch (err) {
    console.log("Error from verifyEmail: " , err);
    if(!res.headersSent){
      res.status(500).json({error: "Internal server error"});
    }
    res.status(500).json({ error: "Server error" });
  }
};

const sendNewCode = async(req , res) => {
  const { email } = req.body;
  const vereificationCode = Math.floor(10000 + Math.random() * 900000).toString();
  try {
    const user = await User.findOne({ email });

    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    if(user && user.registed === true){
      return res.status(400).json({message: "User already registed"})
    }
    user.vereificationCode = vereificationCode;
    await user.save();
    await sendVerificationCode(email , vereificationCode);
    res.status(200).json({message: "check your email again"})
  } catch (err) {
    console.log("Error from sendNewCode: " , err);
    res.status(500).json({ error: "Server error" });
  }
}



/**
 * @description Login 
 * @route       /api/auth/login
 * @method      POST
 * @access      public
 */

const loginController = async(req, res) => {
  const { error } = ValidationLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, remmber } = req.body;
  try {
    const user = await User.findOne({ email }).select("-refreshToken");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.registed === false) {
      return res.status(400).json({ message: "Complete creating your account" });
    }

    const comparePassword = await bcryptjs.compare(password, user.password);
    if (email !== user.email || comparePassword === false) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const accessToken = createToken(user);
    const createRefreshToken = refreshToken(user);

    user.refreshToken = createRefreshToken;
    
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken: createRefreshToken
    });
  } catch (err) {
    console.log("Error from loginController: " , err);
    res.status(500).json({ error: "Server error" });
  }
};



const verifyRefreshToken = async(req , res) => {
  const { refreshToken } = req.body;
  if(!refreshToken){
    return res.status(401).json({message: "is logout"});
  };
  const user = await User.findOne({ refreshToken })
  .select("-refreshToken").select("-password");
  if(!user){
    return res.status(403);
  };

  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY_REFRESH, (err , decoded) => {
    if(err){
      return res.status(403)
    }
    const accessToken = createToken(user);
    res.status(200).json({ accessToken:accessToken , user: user });
  })
};

const logoutController = async(req , res) => {
  const user = await User.findOne({refreshToken: req.cookies.refreshToken})
  if(user){
    user.refreshToken = null;
    await user.save();
  };
  res.clearCookie("refreshToken");
  res.status(200).json({message: "logout successfully"});
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  verifyEmail,
  verifyRefreshToken,
  sendNewCode,
};