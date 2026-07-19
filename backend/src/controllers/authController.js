import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Generate JWT helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "default_jwt_secret_key",
    { expiresIn: "7d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }

    const { name, email, password, avatar } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      return next(error);
    }

    // Create user (password is hashed in pre-save hook)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      provider: "local",
      avatar: avatar || ""
    });

    await user.save();

    // Hide password before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: userResponse
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Login local user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.provider !== "local") {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    // Generate JWT
    const token = generateToken(user);

    // Hide password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      status: "success",
      token,
      user: userResponse
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    // User is attached by verifyToken middleware (excluding password)
    return res.status(200).json({
      status: "success",
      user: req.user
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Google OAuth Success Callback
// @route   GET /api/auth/google/callback
// @access  Private (internal OAuth redirect callback)
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=GoogleAuthFailed`);
    }

    // Generate JWT
    const token = generateToken(user);

    // Redirect to frontend login/callback landing with token
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?token=${token}`);
  } catch (err) {
    console.error("Google OAuth Callback processing error:", err);
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=InternalServerError`);
  }
};
