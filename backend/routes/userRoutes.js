const express = require("express");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. READ ALL USERS (admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json(users);
});

module.exports = router;
