const express = require("express");
const { body, param, matchedData } = require("express-validator");
const Food = require("../models/Food");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

const idRule = param("id").isMongoId().withMessage("Invalid food id");

// On update every field is optional, but whatever is sent must still be valid
const foodRules = (isUpdate) => {
  const field = (name) => (isUpdate ? body(name).optional() : body(name));

  return [
    field("name")
      .isString().withMessage("Name is required")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ max: 100 }).withMessage("Name must be at most 100 characters"),
    field("price")
      .isFloat({ min: 0 }).withMessage("Price must be a number of 0 or more")
      .toFloat(),
    field("category")
      .isString().withMessage("Category is required")
      .trim()
      .notEmpty().withMessage("Category is required"),
    body("description")
      .optional()
      .isString().withMessage("Description must be text")
      .trim()
      .isLength({ max: 300 }).withMessage("Description must be at most 300 characters"),
    field("stock")
      .isInt({ min: 0 }).withMessage("Stock must be a whole number of 0 or more")
      .toInt()
  ];
};

// Only fields that passed validation are saved, so clients can't set _id, timestamps, etc.
const foodFields = (req) => matchedData(req, { locations: ["body"] });

// 1. CREATE (admin only)
router.post("/", protect, authorize("admin"), foodRules(false), validate, async (req, res) => {
  const food = await Food.create(foodFields(req));
  res.status(201).json(food);
});

// 2. READ ALL (public)
router.get("/", async (req, res) => {
  const foods = await Food.find();
  res.status(200).json(foods);
});

// 3. READ ONE BY ID (public)
router.get("/:id", idRule, validate, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    return res.status(404).json({ message: "Food item not found" });
  }
  res.status(200).json(food);
});

// 4. UPDATE (admin only)
router.put("/:id", protect, authorize("admin"), idRule, foodRules(true), validate, async (req, res) => {
  const food = await Food.findByIdAndUpdate(req.params.id, foodFields(req), {
    returnDocument: "after",
    runValidators: true
  });
  if (!food) {
    return res.status(404).json({ message: "Food item not found" });
  }
  res.status(200).json(food);
});

// 5. DELETE (admin only)
router.delete("/:id", protect, authorize("admin"), idRule, validate, async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) {
    return res.status(404).json({ message: "Food item not found" });
  }
  res.status(200).json({ message: "Food deleted successfully" });
});

module.exports = router;
