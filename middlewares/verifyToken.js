import jwt from "jsonwebtoken";

const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("token").replace("Bearer ", "");

    try {
      if (!token) {
        return res.status(401).json({ message: "Access denied No token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS);
      console.log("decoded", decoded);

      req.user = decoded;

      // Check if the user's role is allowed
      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient privileges" });
      }
      console.log("req.user", req.user);

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token Expired. Please log in again" });
      }
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "You Are Not Allowed , Only Admin Allowed" });
    }
  });
};

const verifyTokenAndAutherization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ messege: "You Are Not Allowed" });
    }
  });
};

export { verifyToken, verifyTokenAndAdmin, verifyTokenAndAutherization };
