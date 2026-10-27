const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { body, param, query } = require("express-validator");
const Food = require("../models/Food");
const Order = require("../models/Order");
const { ACTIVE_STATUSES, PICKUP_SLOTS } = require("../models/Order");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

// The canteen moves an order forward one step at a time
const NEXT_STATUS = { placed: "preparing", preparing: "ready", ready: "collected" };
const MINUTES_PER_ORDER = 3;
const MAX_QUANTITY = 10;

const idRule = param("id").isMongoId().withMessage("Invalid order id");

// Orders waiting to be made, and a rough wait estimate for the dashboard
const queueStats = async () => {
  const activeOrders = await Order.countDocuments({ status: mongoose.trusted({ $in: ["placed", "preparing"] }) });
  return { activeOrders, estimatedWaitMinutes: activeOrders * MINUTES_PER_ORDER };
};

// Push an order change to its owner, to canteen staff, and the new queue size to everyone.
// Staff events have their own names so a staff member's own order list never picks them up.
const broadcast = async (req, order, staffEvent) => {
  const io = req.app.get("io");
  io.to(`user:${order.user}`).emit("order:updated", order);
  io.to("staff").emit(staffEvent, order);
  io.emit("queue:update", await queueStats());
};

const restock = (items) =>
  Promise.all(items.map(({ food, quantity }) => Food.updateOne({ _id: food }, { $inc: { stock: quantity } })));

// Short, readable pickup code, e.g. CE-7K2QF
const newToken = () => `CE-${crypto.randomBytes(4).toString("hex").slice(0, 5).toUpperCase()}`;

// 1. PLACE AN ORDER (students only; canteen staff manage orders, they don't place them)
router.post(
  "/",
  protect,
  authorize("student"),
  [
    body("items").isArray({ min: 1, max: 20 }).withMessage("Your cart is empty"),
    body("items.*.food").isMongoId().withMessage("Invalid menu item"),
    body("items.*.quantity").isInt({ min: 1, max: MAX_QUANTITY }).withMessage(`Quantity must be 1 to ${MAX_QUANTITY}`).toInt(),
    body("pickupSlot").isIn(PICKUP_SLOTS).withMessage("Select a valid pickup slot"),
    body("rollNumber")
      .isString().withMessage("Roll number is required")
      .trim()
      .matches(/^[A-Za-z0-9-]{3,15}$/).withMessage("Enter a valid roll number")
  ],
  validate,
  async (req, res) => {
    // Merge repeated items so stock is checked once per dish
    const quantities = new Map();
    for (const { food, quantity } of req.body.items) {
      quantities.set(food, Math.min(MAX_QUANTITY, (quantities.get(food) || 0) + quantity));
    }

    const foods = await Food.find({ _id: mongoose.trusted({ $in: [...quantities.keys()] }) });
    const foodById = new Map(foods.map((food) => [food.id, food]));
    for (const id of quantities.keys()) {
      const food = foodById.get(id);
      if (!food || food.available === false) {
        return res.status(400).json({ message: `${food ? food.name : "An item in your cart"} is no longer available` });
      }
    }

    // Reserve stock item by item; undo the earlier reservations if one runs out
    const reserved = [];
    for (const [id, quantity] of quantities) {
      const updated = await Food.findOneAndUpdate(
        { _id: id, stock: mongoose.trusted({ $gte: quantity }) },
        { $inc: { stock: -quantity } }
      );
      if (!updated) {
        await restock(reserved);
        const food = foodById.get(id);
        return res.status(409).json({ message: `Sorry, only ${food.stock} ${food.name} left` });
      }
      reserved.push({ food: id, quantity });
    }

    // Prices always come from the database, never from the browser
    const items = reserved.map(({ food, quantity }) => {
      const { name, price } = foodById.get(food);
      return { food, name, price, quantity };
    });
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let order;
    for (let attempt = 0; attempt < 5 && !order; attempt++) {
      try {
        order = await Order.create({
          user: req.user._id,
          customerName: req.user.name,
          rollNumber: req.body.rollNumber,
          items,
          total,
          pickupSlot: req.body.pickupSlot,
          token: newToken()
        });
      } catch (error) {
        if (error.code !== 11000) {
          await restock(reserved);
          throw error;
        }
      }
    }
    if (!order) {
      await restock(reserved);
      return res.status(500).json({ message: "Could not create the order, please try again" });
    }

    await broadcast(req, order, "staff:order-new");
    res.status(201).json(order);
  }
);

// 2. MY ORDERS (newest first)
router.get("/mine", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json(orders);
});

// 3. QUEUE SIZE (any logged-in user)
router.get("/queue", protect, async (req, res) => {
  res.status(200).json(await queueStats());
});

// 4. CANCEL MY ORDER (only before the canteen starts preparing it)
router.patch("/:id/cancel", protect, idRule, validate, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.status !== "placed") {
    return res.status(409).json({ message: "This order is already being prepared and can't be cancelled" });
  }

  order.status = "cancelled";
  await order.save();
  await restock(order.items);
  await broadcast(req, order, "staff:order-updated");
  res.status(200).json(order);
});

// 5. ALL ORDERS (canteen staff / admin) — active ones oldest first, like a kitchen queue
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  query("scope").optional().isIn(["active", "all"]).withMessage("scope must be active or all"),
  validate,
  async (req, res) => {
    const filter = req.query.scope === "all" ? {} : { status: mongoose.trusted({ $in: ACTIVE_STATUSES }) };
    const orders = await Order.find(filter)
      .sort({ createdAt: req.query.scope === "all" ? -1 : 1 })
      .limit(100);
    res.status(200).json(orders);
  }
);

// 6. UPDATE STATUS (canteen staff / admin)
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  idRule,
  body("status").isIn(["preparing", "ready", "collected", "cancelled"]).withMessage("Invalid status"),
  validate,
  async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { status } = req.body;
    const canCancel = status === "cancelled" && ACTIVE_STATUSES.includes(order.status);
    if (!canCancel && NEXT_STATUS[order.status] !== status) {
      return res.status(409).json({ message: `An order that is ${order.status} can't be marked ${status}` });
    }

    order.status = status;
    await order.save();
    if (status === "cancelled") {
      await restock(order.items);
    }
    await broadcast(req, order, "staff:order-updated");
    res.status(200).json(order);
  }
);

module.exports = router;
