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
                      .post(logoutController)


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
    const accessToken = createToken(user);
    const refreshToken = refreshToken(user);

    user.refreshToken = refreshToken;
    user.save();

    res.cookie("refreshToken", refreshToken , {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    

    res.status(200).json({message: "register successfully" , user , accessToken})
  });


router.get("/google/login" , passport.authenticate("googleLogin" , {
  scope: ["profile" , "email"]
}));

router.get("/google/login/callback" , (req ,res ,next) => {
  passport.authenticate("googleLogin" ,{ session: false } , (err , user , info) => {
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(400).json({message: "No account found for this Google account"})
    }

    const accessToken = createToken(user);

    res.status(200).json({message: "login successfully" , user , accessToken})
  })(req , res , next)
});

module.exports = router;