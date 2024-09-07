const jwt = require("jsonwebtoken");

//Access Token
const createToken = (user) => {
    return jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET_KEY_ACCESS, { expiresIn: "1m"});
}

//Refresh Token
const refreshToken = (user) => {
    return jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET_KEY_REFRESH, {expiresIn: "21d"});
  }

module.exports = {
  createToken,
  refreshToken
};