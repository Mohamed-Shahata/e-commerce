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
                        .get(registerControllerView)
                        .post(registerController)

router.route("/verify")
                      .post(verifyEmail);

router.route("/login")
                      .get(loginControllerView)
                      .post(loginController)


router.get("/google" , passport.authenticate("google" , {
  scope: ["profile" , "email"]
}));

router.get("/google/callback" , passport.authenticate("google" ,
  { session: false , failureRedirect: "/" }
) , 
  (req , res) => {
    res.render("register/home");
  });

module.exports = router;