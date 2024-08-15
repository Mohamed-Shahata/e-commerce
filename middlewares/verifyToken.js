const jwt = require("jsonwebtoken");

const verifyToken = async(req , res , next) => {
  const token = req.header("token");

  if(!token){
    return res.status(401).json({message: "Access denied No token"})
  }

  try {
    const decoded = await jwt.verify(token , process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    if(err.name === "TokenExpiredError"){
      return res.status(401).json({message: "Token Expired. Please log in again"})
    }
    res.status(401).json({message: "Invalid token"});
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
  verifyToken(req , res , () => {
    if(req.user.id === req.params.id || req.user.isAdmin){
      next();
    }else{
      return res.status(403).json({messege: "You Are Not Allowed"});
    }
  })
}


module.exports = { 
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAutherization
};