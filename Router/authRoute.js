const express = require("express");
const {
  registerController,
  loginController,
  registerControllerView,
  verifyEmail,
  loginControllerView,
} = require("../Controllers/authController");
const passport = require("passport");
const router = express.Router();


router.route("/register")
                        .post(registerController)

router.route("/verify")
                      .post(verifyEmail);

router.route("/login")
                      .post(loginController)


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
    const { token , user } = req.user;
    res.status(200).json({message: "register successfully" , user , token})
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
    res.status(200).json({message: "login successfully" , user })
  })(req , res , next)
});

module.exports = router;