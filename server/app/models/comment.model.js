const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    body: {
      type: String,
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    // childrenId: {//reply of reply
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Comment",
    //   default: null,
    // },
  })
);

module.exports = Comment;
