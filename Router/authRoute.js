const express = require("express");
const {
  registerController,
  loginController,
  verifyEmail,
  verifyRefreshToken,
  logoutController,
  sendNewCode,
} = require("../Controllers/authController");
const passport = require("passport");
const { verifyTokenAndAutherization } = require("../middlewares/verifyToken.js");
const router = express.Router();


router.route("/register")
                        .post(registerController)

router.route("/verify")
                      .post(verifyEmail);

router.route("/new-code")
                      .post(sendNewCode);

router.route("/refresh-token")
                      .post(verifyRefreshToken);

router.route("/login")
                      .post(loginController)

router.route("/logout")
                      .post(verifyTokenAndAutherization,logoutController)


router.get("/google/register" , passport.authenticate("googleRegister" , {
  scope: ["profile" , "email"],
  accessType: 'offline',
  prompt: 'consent'
}));

router.get("/google/register/callback" , passport.authenticate("googleRegister" ,
  { session: false }
) , 
  async(req , res) => {
    if(req.authInfo && req.authInfo.message === "User already exists"){
      return res.status(400).json({message: "User already exists"})
    }
    const user = req.user;
    if(!user){
      return res.status(404).json({message: "User authentication failed"});
    }
    user.refreshToken = req.authInfo.refreshToken
    await user.save();

    const accessToken = req.authInfo.accessToken
    const createRefreshToken = req.authInfo.refreshToken

    res.cookie("refreshToken", createRefreshToken ,{
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    })

    res.status(200).json({message: "register successfully" , user , accessToken})
  });


  router.get('/google/login', passport.authenticate('googleLogin', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
  }));
  
  router.get('/google/login/callback',passport.authenticate('googleLogin', { session: false }), 
    async(req ,res) => {
      if(req.authInfo && req.authInfo.message === "No account found for this Google account"){
        return res.status(400).json({message: "No account found for this Google account"})
      }

      const user = req.user;
      if(!user){
        return res.status(404).json({message: "User not found"});
      }
      user.refreshToken = req.authInfo.refreshToken
      await user.save();

      const accessToken = req.authInfo.accessToken
      const createRefreshToken = req.authInfo.refreshToken

      res.cookie("refreshToken", createRefreshToken ,{
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      })

      res.status(200).json({ message: 'Login successfully', user, accessToken });
    })
  
  module.exports = router;