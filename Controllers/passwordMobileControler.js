import { User } from "../Model/User.js";
import { createTransport } from "nodemailer";
import bcryptjs from "bcryptjs";

/**
 * @description Send Forgot Password Link
 * @route       /password/forgot-password
 * @method      POST
 * @access      public
 */
const sendForgotPasswordMobile = async(req , res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({message: "User not found"});
    };

    if(user.registed === false){
      return res.status(400).json({message: "Complete creating your account"})
    }

    try {
      const code = Math.floor(10000 + Math.random() * 900000).toString();
      user.codeRestPassword = code;
      await user.save();

    const trnasporter = createTransport({
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
        <p>${code}</p>
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

    res.status(200).json({
      message: "Link for reset your password has been send to your email",
      email: user.email
    });

  } catch (err) {
    console.log("error sendForgotPasswordLink: " , err)
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

const verifyCode = async(req ,res) => {
    const { code } = req.body
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(code != user.codeRestPassword){
            return res.status(400).json({message: "code is wrong"});
        }
        user.codeRestPassword = null;
        await user.save();
        res.status(200).json({message: "Code is successfully", email: user.email});
    } catch (err) {
        console.log("error resetThePassword: " , err);
        res.status(500).json({error: "Server error"});
    }
}
const resetThePasswordMobile = async(req , res) => {
  const user = await User.findOne({email: req.body.email});
  if(!user){
    return res.status(404).json({message: "User not found"});
  }

  if(user.codeRestPassword !== null){
    return res.status(400).json({message: "Enter the code from your gmail"})
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(req.body.password , salt);
    await user.save();


    res.status(200).json({message: "Rest password successfully"})
  } catch (err) {
    console.log("error resetThePassword: " , err);
    res.status(500).json({error: "Server error"});
  }
};


export {
    sendForgotPasswordMobile,
    verifyCode,
    resetThePasswordMobile
};