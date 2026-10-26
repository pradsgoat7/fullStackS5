const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// Stricter limit on auth endpoints to slow down password guessing.
// Only failed attempts count, so normal logins are not blocked.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again after 15 minutes." }
});

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h"
  });

// 1. REGISTER
router.post(
  "/register",
  authLimiter,
  [
    body("name")
      .isString().withMessage("Name is required")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ max: 50 }).withMessage("Name must be at most 50 characters"),
    body("email")
      .isString().withMessage("Enter a valid email")
      .trim()
      .toLowerCase()
      .isEmail().withMessage("Enter a valid email"),
    body("password")
      .isString().withMessage("Password is required")
      .isLength({ min: 8, max: 72 }).withMessage("Password must be 8 to 72 characters")
      .matches(/[A-Za-z]/).withMessage("Password must contain a letter")
      .matches(/\d/).withMessage("Password must contain a number")
  ],
  validate,
  async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // role is never taken from the request body, so nobody can sign up as admin
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "Registered successfully",
      token: signToken(user),
      user
    });
  }
);

// 2. LOGIN
router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .isString().withMessage("Enter a valid email")
      .trim()
      .toLowerCase()
      .isEmail().withMessage("Enter a valid email"),
    body("password")
      .isString().withMessage("Password is required")
      .notEmpty().withMessage("Password is required")
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    const isMatch = user && (await user.comparePassword(password));

    // Same message for unknown email and wrong password, so emails can't be probed
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Logged in successfully",
      token: signToken(user),
      user
    });
  }
);

// 3. PROFILE (any logged-in user)
router.get("/profile", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
