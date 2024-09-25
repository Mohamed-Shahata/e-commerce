import jwt from "jsonwebtoken";

//Access Token
const createToken = (user) => {
    return jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
      role: user.role
    }, process.env.JWT_SECRET_KEY_ACCESS, { expiresIn: "1d"});
}

//Refresh Token
const refreshToken = (user) => {
    return jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
      role: user.role
    }, process.env.JWT_SECRET_KEY_REFRESH, {expiresIn: "21d"});
  }

export {
  createToken,
  refreshToken
};