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
      // 1: "Requested"
      // 2: "Pending"
      // 3: "Blocked"
      // 4: "Accepted" or "friend"

      type: Number,
      enums: [1, 2, 3, 4],
    },
  })
);

module.exports = Friend;
