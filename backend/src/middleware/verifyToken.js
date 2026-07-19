import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Access denied. No token provided.");
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];
    
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");
    
    // Find corresponding User (to verify they still exist and support user profile lookup)
    const user = await User.findById(decoded.id || decoded.userId).select("-password");
    if (!user) {
      const error = new Error("User not found or session invalid.");
      error.statusCode = 401;
      return next(error);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification error:", err.message);
    const error = new Error("Session expired or invalid token. Please log in again.");
    error.statusCode = 401;
    return next(error);
  }
};

export default verifyToken;
