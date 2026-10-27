const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    // Display details for the menu cards
    image: {
      type: String,
      trim: true
    },
    prepTime: {
      type: Number, // minutes
      min: 0
    },
    tag: {
      type: String,
      trim: true,
      maxlength: 30
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);
