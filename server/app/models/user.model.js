const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    pic: {
      type: String,
    },
    // pic: { //IF we want to link to Schema
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "UserImage",
    // }
    status: { type: String, default: "public", enum: ["public", "private"] },
    friendvisibility: {
      type: Boolean,
      default: true,
    },
    resetToken: String,
    expireToken: Date,
  })
);

module.exports = User;
