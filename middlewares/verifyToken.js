const jwt = require("jsonwebtoken");

const verifyToken = async(req , res , next) => {

  // تحقق من وجود الـ token قبل استبدال "Bearer "
  const authHeader = req.header("token");

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired. Please log in again" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};


const verifyTokenAndAdmin = (req , res , next) => {
  verifyToken(req , res , () => {
    if(req.user.isAdmin){
      next();
    }else{
      return res.status(401).json({message: "You Are Not Allowed , Only Admin Allowed"});
    }
  })
};

const verifyTokenAndAutherization = (req , res , next) => {
  try {
    verifyToken(req , res , () => {
      if(req.user._id === req.params.id || req.user.isAdmin){
        next();
      }else{
        return res.status(403).json({messege: "You Are Not Allowed"});
      }
    })
  } catch (error) {
    return res.status(403).json({messege: "error"});
  }
}


module.exports = { 
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAutherization
};