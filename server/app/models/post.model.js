const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      caption: {
        type: String,
        required: true,
      },
      // body: {
      //   type: String,
      //   //   required: true,
      // },
      pic: {
        type: String,
        //   required: true,
      },
      likes: {
        total: {
          type: Number,
          default: 0,
          min: 0,
        },
        by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      likeanalytics: [
        {
          userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          at: { type: Date, default: Date.now() },
        },
      ],
      taggedperson: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      tags: [
        {
          type: String,
        },
      ],
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      shared: {
        //for shared Post
        type: Boolean,
        default: false,
      },
      sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      visibility: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Post;
