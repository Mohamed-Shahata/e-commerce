const express = require("express");
const {
  registerController,
  loginController,
  verifyEmail,
  verifyRefreshToken,
  logoutController
} = require("../Controllers/authController");
const passport = require("passport");
const { createToken, refreshToken } = require("../config/jwt");
const { verifyTokenAndAutherization } = require("../middlewares/verifyToken.js");
const router = express.Router();


router.route("/register")
                        .post(registerController)

router.route("/verify")
                      .post(verifyEmail);

router.route("/refresh-token")
                      .post(verifyRefreshToken);

router.route("/login")
                      .post(loginController)

router.route("/logout")
                      .post(verifyTokenAndAutherization,logoutController)


router.get("/google/register" , passport.authenticate("googleRegister" , {
  scope: ["profile" , "email"]
}));

router.get("/google/register/callback" , passport.authenticate("googleRegister" ,
  { session: false }
) , 
  (req , res) => {
    if(req.authInfo && req.authInfo.message === "User already exists"){
      return res.status(400).json({message: "User already exists"})
    }
    const user = req.user;

    const accessToken = createToken(user);
    const createRefreshToken = refreshToken(user);

    user.refreshToken = createRefreshToken;
    user.save();

    res.cookie("refreshToken", createRefreshToken , {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({message: "register successfully" , user , accessToken})
  });


  router.get('/google/login', passport.authenticate('googleLogin', {
    scope: ['profile', 'email'],
  }));
  
  router.get('/google/login/callback',passport.authenticate('googleLogin', { session: false }), 
    async(req ,res) => {
      if(req.authInfo && req.authInfo.message === "No account found for this Google account"){
        return res.status(400).json({message: "No account found for this Google account"})
      }

      const user = req.user;
      console.log(user + "\n" + req.refreshToken + "\n" + req.accessToken)

      user.refreshToken = req.refreshToken
      await user.save();

      res.cookie("refreshToken", req.refreshToken ,{
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      })


      res.status(200).json({ message: 'Login successfully', user, accessToken:req.accessToken });
    })
  
  module.exports = router;