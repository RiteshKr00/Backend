const mongoose = require("mongoose");

const Tags = mongoose.model(
  "Tags",
  new mongoose.Schema({
    tag: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports = Tags;
