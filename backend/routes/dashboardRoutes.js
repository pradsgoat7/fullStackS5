const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. STUDENT DASHBOARD (any logged-in user)
router.get("/", protect, (req, res) => {
  res.status(200).json({
    message: `Welcome to the CampusEats dashboard, ${req.user.name}!`,
    user: req.user
  });
});

module.exports = router;
