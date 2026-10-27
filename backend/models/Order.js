const mongoose = require("mongoose");

const ORDER_STATUSES = ["placed", "preparing", "ready", "collected", "cancelled"];
const ACTIVE_STATUSES = ["placed", "preparing", "ready"];
const PICKUP_SLOTS = ["ASAP (Next Available)", "12:30 PM - 1:00 PM", "1:00 PM - 1:30 PM", "1:30 PM - 2:00 PM"];

// Name and price are copied from the menu when the order is placed, so later
// menu changes never alter what a student was charged
const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 10 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customerName: { type: String, required: true },
    rollNumber: { type: String, required: true, trim: true },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "An order needs at least one item"]
    },
    total: { type: Number, required: true, min: 0 },
    pickupSlot: { type: String, enum: PICKUP_SLOTS, required: true },
    token: { type: String, required: true, unique: true },
    status: { type: String, enum: ORDER_STATUSES, default: "placed", index: true }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
module.exports.ACTIVE_STATUSES = ACTIVE_STATUSES;
module.exports.PICKUP_SLOTS = PICKUP_SLOTS;
