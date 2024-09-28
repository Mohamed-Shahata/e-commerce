import {
  User,
  ValidationRegisterUser,
  ValidationLoginUser,
} from "../Model/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationCode } from "../utils/sendEmail.js";
import { createToken, refreshToken } from "../config/jwt.js";
import { Admin } from "../Model/admin.model.js";
import { Client } from "../Model/client.model.js";

/**
 * @description Register
 * @route       /api/auth/register
 * @method      POST
 * @access      public
 */
const registerController = async (req, res) => {
  const { firstName, lastName, email, password, gender, role } = req.body;

  // Validate user input
  const { error } = ValidationRegisterUser({
    firstName,
    lastName,
    email,
    password,
    gender,
    role,
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const vereificationCode = Math.floor(
    10000 + Math.random() * 900000
  ).toString();

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (user && user.registed === false) {
      // User exists but is not registered, update the verification code
      user.vereificationCode = vereificationCode;
      await user.save();
      await sendVerificationCode(email, vereificationCode);
      return res
        .status(401)
        .json({ message: "Verification code sent, please verify your email" });
    }

    // If user does not exist, create a new user based on role
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    switch (role) {
      case "admin":
        user = new Admin({
          firstName,
          lastName,
          email,
          password: hashPassword,
          gender,
          vereificationCode,
          permissions: ["manage-users", "view-reports"], // Example permissions
        });
        break;

      case "client":
        user = new Client({
          firstName,
          lastName,
          email,
          password: hashPassword,
          gender,
          vereificationCode,
          address: req.body.address, // Assuming address is part of Client registration
          phone: req.body.phone, // Assuming phone is part of Client registration
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid role provided" });
    }

    // Save the user and send verification code
    await user.save();
    await sendVerificationCode(email, vereificationCode);

    res
      .status(200)
      .json({ message: "Check your email for the verification code" });
  } catch (err) {
    console.log("Error from register: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @description Verify Email Code
 * @route       /api/auth/verify
 * @method      POST
 * @access      public
 */
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email }).select("role vereificationCode");
    console.log({ user });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.vereificationCode !== code) {
      return res.status(401).json({ message: "The code is worng" });
    }

    const accessToken = createToken(user);
    const createRefreshToken = refreshToken(user);

    user.registed = true;
    user.vereificationCode = "";

    user.refreshToken = createRefreshToken;
    await user.save();

    // res.cookie("refreshToken", createRefreshToken, {
    //   secure: false,
    //   sameSite: "lax",
    //   path: "/",
    // });
    res.cookie("accessToken", accessToken, {
      httpOnly: false, // Accessible via JS on the client-side
      secure: true, // Use HTTPS in production
      sameSite: "Strict",
    });

    res.cookie("refreshToken", createRefreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
    });
    return res
      .status(200)
      .json({ message: "verify successfully", user, accessToken });
  } catch (err) {
    console.log("Error from verifyEmail: ", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const sendNewCode = async (req, res) => {
  const { email } = req.body;
  const vereificationCode = Math.floor(
    10000 + Math.random() * 900000
  ).toString();
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user && user.registed === true) {
      return res.status(400).json({ message: "User already registed" });
    }
    user.vereificationCode = vereificationCode;
    await user.save();
    await sendVerificationCode(email, vereificationCode);
    res.status(200).json({ message: "check your email again" });
  } catch (err) {
    console.log("Error from sendNewCode: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @description Login
 * @route       /api/auth/login
 * @method      POST
 * @access      public
 */

const loginControllerView = (req, res) => {
  res.render("login/login");
};

const loginController = async (req, res) => {
  const { error } = ValidationLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, remmber } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.registed === false) {
      return res
        .status(400)
        .json({ message: "Complete creating your account" });
    }
    const comparePassword = bcryptjs.compare(password, user.password);

    if (email !== user.email || comparePassword == false) {
      return res.status(401).json({ message: "email or password is worng" });
    }

    const accessToken = createToken(user);
    const createRefreshToken = refreshToken(user);

    user.refreshToken = createRefreshToken;
    await user.save();

    res.cookie("refreshToken", createRefreshToken, {
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      message: "login successfully",
      user,
      accessToken,
      createRefreshToken,
    });
  } catch (err) {
    console.log("Error from Login: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "is logout" });
  }
  const user = await User.findOne({ refreshToken })
    .select("-refreshToken")
    .select("-password");
  if (!user) {
    return res.status(403);
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_KEY_REFRESH,
    (err, decoded) => {
      if (err) {
        return res.status(403);
      }
      const accessToken = createToken(user);
      res.status(200).json({ accessToken: accessToken, user: user });
    }
  );
};

const logoutController = async (req, res) => {
  const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "logout successfully" });
};

export {
  registerController,
  loginController,
  logoutController,
  verifyEmail,
  verifyRefreshToken,
  sendNewCode,
  loginControllerView,
};
