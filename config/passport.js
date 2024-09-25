import passport from "passport";
import { Strategy as GoogleStratgy } from "passport-google-oauth20";
import { User } from "../Model/User.js";

import bcryptjs from "bcryptjs";
import { randomBytes } from "crypto";
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  "googleRegister",
  new GoogleStratgy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_URL_REGISTER,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user, { message: "User already exists" });
        }
        const password = randomBytes(16).toString("hex");
        const firstName = profile.name.givenName || "";
        const lastName = profile.name.familyName || "";

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);
        user = await User({
          firstName: firstName,
          lastName: lastName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          password: hashPassword,
          registed: true,
          vereificationCode: null,
        });
        await user.save();

        return done(null, user, { accessToken, refreshToken });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  "googleLogin",
  new GoogleStratgy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_URL_LOGIN,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          return done(null, false, {
            message: "No account found for this Google account",
          });
        }

        return done(null, user, { accessToken, refreshToken });
      } catch (err) {
        done(err, false);
      }
    }
  )
);
