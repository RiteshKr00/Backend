const mongoose = require("mongoose");

const UserImages = mongoose.model(
  "UserImages",
  new mongoose.Schema({
    publicId: {
      //Every asset uploaded to Cloudinary is assigned a unique identifier in the form of a Public ID
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
