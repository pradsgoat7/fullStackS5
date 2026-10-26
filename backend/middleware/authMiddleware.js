const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the Bearer token and loads the current user onto req.user
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch (error) {
    // Tell the client whether to log in again or whether the token itself is bad
    const message = error.name === "TokenExpiredError"
      ? "Token has expired, please log in again"
      : "Invalid or malformed token";
    return res.status(401).json({ message });
  }

  // Look the user up so deleted accounts and role changes take effect immediately
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "User for this token no longer exists" });
  }

  req.user = user;
  next();
};

// Allows the request through only if the logged-in user has one of the given roles
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Forbidden: role '${req.user.role}' is not allowed to access this resource`
    });
  }
  next();
};

module.exports = { protect, authorize };
