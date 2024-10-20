
import { 
  User,
  ValidationRegisterUser,
  ValidationLoginUser
 } from "../Model/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationCode } from "../utils/sendEmail.js"
import { createToken, refreshToken } from "../config/jwt.js"

/**
 * @description Register
 * @route       /api/auth/register
 * @method      POST
 * @access      public
 */
const registerController = async(req , res) => {
  const { firstName , lastName , email , password , gender } = req.body;
  const { error } = ValidationRegisterUser({ firstName , lastName , email , password , gender });
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let user = await User.findOne({ email });

    if(user){
      return res.status(400).json({message: "User already exists"})
    }

    if(user && user.registered === true){
      return res.status(400).json({message: "User already exsist"});
    }else if(user && user.registered === false){

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      user.verificationCode = verificationCode;
      await user.save();
      await sendVerificationCode(email , verificationCode);
      return res.status(401).json({message: "The code is worng"});
    }else{

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password , salt);

    user = new User({
      firstName,
      lastName,
      password: hashPassword,
      email,
      verificationCode,
      gender
    });
    await user.save();
    await sendVerificationCode(email , verificationCode);

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

    if(user.verificationCode !== code){
      return res.status(401).json({message: "The code is worng"})
    }

    const accessToken = createToken(user);
    const createRefreshToken = refreshToken(user);

    user.registered = true;
    user.verificationCode = null;

    user.refreshToken = createRefreshToken;
    await user.save();
    user.refreshToken = undefined;
    user.password = undefined;

    return res.status(200).json({
      message: "verify successfully" ,
      user ,
      accessToken ,
      refreshToken: createRefreshToken
    })
  
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
    user.refreshToken = undefined;
    user.password = undefined;

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
try {
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
} catch (err) {
  console.log("Error from verifyRefreshToken: " , err);
  res.status(500).json({ error: "Server error" });
}
};

const logoutController = async(req , res) => {
  const user = await User.findOne({refreshToken: req.body.refreshToken})
  if(user){
    user.refreshToken = null;
    await user.save();
  }else{
    return res.status(200).json({message: "user not found"});
  }
  res.status(200).json({message: "logout successfully"});
}

export {
  registerController,
  loginController,
  logoutController,
  verifyEmail,
  verifyRefreshToken,
  sendNewCode,
};