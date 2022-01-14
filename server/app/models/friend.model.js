const mongoose = require("mongoose");

const Friend = mongoose.model(
  "Friend",
  new mongoose.Schema({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      // Status states
      // =============
      // 1: "pending"
      // 2: "accepted"
      // 3: "rejected"
      // 4: "blocked"

      type: Number,
      default: 1,
    },
  })
);

module.exports = Friend;
