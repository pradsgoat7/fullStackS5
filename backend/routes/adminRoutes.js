const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Food = require("../models/Food");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const LOW_STOCK_THRESHOLD = 5;

// 1. ADMIN PANEL (admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
  const [students, staff, admins, foodItems, lowStockItems] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "staff" }),
    User.countDocuments({ role: "admin" }),
    Food.countDocuments(),
    // trusted(): this operator is built server-side, so sanitizeFilter must not neutralise its $lte
    Food.countDocuments({ stock: mongoose.trusted({ $lte: LOW_STOCK_THRESHOLD }) })
  ]);

  res.status(200).json({
    message: `Welcome to the CampusEats admin panel, ${req.user.name}! Authorized admin access granted.`,
    stats: { students, staff, admins, foodItems, lowStockItems },
    user: req.user
  });
});

module.exports = router;
