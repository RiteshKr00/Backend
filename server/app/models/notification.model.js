const mongoose = require("mongoose");

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      senderid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      receiverid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      event: {
        type: Number,
        enum: [1, 2, 3, 4, 5], //1: LikePost 2: LikeComment 3:Comment 4:Sent Friend Request 5.Accepted Friend Request
      },
      //id of post Liked or commented
      postid: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      //id of comment which is Liked
      commentid: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
      seen: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

module.exports = Notification;
