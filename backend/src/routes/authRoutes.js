import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { register, login, getProfile, googleCallback } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import "../config/passport.js"; // Initialize passport config

const router = Router();

// Rate limiter: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    status: 429,
    message: "Too many requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

// Routes
router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);
router.get("/profile", verifyToken, getProfile);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/google/failure", session: false }),
  googleCallback
);

// Fallback failure route
router.get("/google/failure", (req, res) => {
  res.status(401).json({
    status: "fail",
    message: "Google authentication failed"
  });
});

export default router;
