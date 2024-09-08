const passport = require("passport");
const GoogleStratgy = require("passport-google-oauth20").Strategy;
const { User } = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { createToken, refreshToken } = require("../config/jwt.js");

passport.use("googleRegister" , new GoogleStratgy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_URL_REGISTER
},
  async(accessToken1 , refreshToken1 , profile , done) => {
    try {
      let user = await User.findOne({email: profile.emails[0].value});
      if(user){
        return done(null , user , {message: "User already exists"})
      }
      const password = crypto.randomBytes(16).toString("hex");
      const firstName = profile.name.givenName || "";
      const lastName = profile.name.familyName || "";

      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password , salt);
      user = await User({
        firstName: firstName,
        lastName: lastName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
        password: hashPassword,
        registed: true,
        vereificationCode: null
      });
      const accessToken = createToken(user)
      const createRefreshToken = refreshToken(user);
      user.refreshToken = createRefreshToken;
      await user.save();

      return done(null , user ,{ accessToken , createRefreshToken});
    } catch (err) {
      done(err , false)
    }
  }
));

passport.use("googleLogin", new GoogleStratgy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_URL_LOGIN
},
  async(accessToken1 , refreshToken1 , profile , done) => {
    try {
      let user = await User.findOne({email: profile.emails[0].value});
      if(!user){
        return done(null , false , {message: "No account found for this Google account"})
      }

      const accessToken = createToken(user)
      const createRefreshToken = refreshToken(user);
      user.refreshToken = createRefreshToken;
      await user.save();

      return done(null , user ,{ accessToken , createRefreshToken});
    } catch (err) {
      done(err , false)
    }
  }
))