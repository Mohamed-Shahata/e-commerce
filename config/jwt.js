const jwt = require("jsonwebtoken");

//Access Token
const createToken = async(user) => {
  try {
    const token = await jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET_KEY , { expiresIn: "15m"});
    return token;
  } catch (err) {
    console.log("err from createToken: " + err);
  }
}

//Refresh Token
const refreshToken = async(user) => {
  try {
    const token = await jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET_KEY , "21d");
    return token;
  } catch (err) {
    console.log("err from refreshToken: " + err);
  }
}

module.exports = {
  createToken,
  refreshToken
};