const mongoose = require("mongoose");

const UserImages = mongoose.model(
  "UserImages",
  new mongoose.Schema({
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    imgType: {
      type: String,
      required: true,
      enum: ["profile", "gallery"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports = UserImages;
