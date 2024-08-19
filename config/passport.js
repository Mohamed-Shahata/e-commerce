const passport = require("passport");
const GoogleStratgy = require("passport-google-oauth20").Strategy;
const { User } = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


passport.use(new GoogleStratgy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_URL
},
  async(accessToken , refreshToken , profile , done) => {
    try {
      let user = await User.findOne({email: profile.emails[0].value});
      if(!user){
        const password = crypto.randomBytes(16).toString("hex");

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password , salt);
        user = await User({
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          password: hashPassword,
          registed: true,
          vereificationCode: null
        });
        await user.save();
      }
      const token = await jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
      }, process.env.JWT_SECRET_KEY , { expiresIn: "1d"});
      
      return done(null , {user , token});
    } catch (err) {
      done(err , false)
    }
  }
));