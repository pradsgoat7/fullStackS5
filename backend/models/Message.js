const mongoose = require("mongoose");

// A Live Chat message. Name and role are copied in so history renders without extra lookups.
const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
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

module.exports = mongoose.model("Message", messageSchema);
