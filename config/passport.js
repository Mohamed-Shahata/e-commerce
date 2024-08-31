const passport = require("passport");
const GoogleStratgy = require("passport-google-oauth20").Strategy;
const { User } = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");


passport.use("googleRegister" , new GoogleStratgy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CLIENT_URL_REGISTER
},
  async(request , accessToken , refreshToken , profile , done) => {
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
      
      await user.save();
    
      return done(null , user);
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
  async(request , accessToken , refreshToken , profile , done) => {
    try {
      let user = await User.findOne({email: profile.emails[0].value});
      if(!user){
        return done(null , false , {message: "No account found for this Google account"})
      }

      if(refreshToken){
        user.refreshToken = token.access_token; // حيث `token` هو الكائن الذي يحتوي على الحقول

        await user.save();

        request.res.cookie("refreshToken" , refreshToken ,{
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
        })
      }

      return done(null , {user , accessToken} )
    } catch (err) {
      done(err , false)
    }
  }
))