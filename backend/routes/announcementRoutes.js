const express = require("express");
const { body } = require("express-validator");
const Announcement = require("../models/Announcement");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

const LATEST_LIMIT = 5;

// 1. READ LATEST (any logged-in user)
router.get("/", protect, async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(LATEST_LIMIT);
  res.status(200).json(announcements);
});

// 2. CREATE + BROADCAST (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title")
      .isString().withMessage("Title is required")
      .trim()
      .notEmpty().withMessage("Title is required")
      .isLength({ max: 80 }).withMessage("Title must be at most 80 characters"),
    body("body")
      .isString().withMessage("Message is required")
      .trim()
      .notEmpty().withMessage("Message is required")
      .isLength({ max: 300 }).withMessage("Message must be at most 300 characters")
  ],
  validate,
  async (req, res) => {
    const announcement = await Announcement.create({
      title: req.body.title,
      body: req.body.body,
      createdBy: req.user._id,
      authorName: req.user.name
    });

    // Push it to every connected client right away
    const io = req.app.get("io");
    io.emit("announcement:new", announcement);
    console.log(`[Socket.IO] Announcement broadcast to ${io.engine.clientsCount} client(s): "${announcement.title}"`);

    res.status(201).json(announcement);
  }
);

module.exports = router;
