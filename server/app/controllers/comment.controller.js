const db = require("../models");
const ImageUploadService = require("../utils/ImageUploadService");
const { getPagination } = require("../utils/Pagination");
const Post = db.post;
const Comment = db.comment;
const Notification = db.notification;

exports.createComment = async (req, res) => {
  try {
    const { body } = req.body;
    const postId = req.params.postId;
    const post = await Post.findById( postId );

    if (!body || !body.trim()) {
      return res
        .status(400)
        .json({ error: "Please enter something to the body!" });
    }
    const comment = await new Comment({
      postId: postId,
      body: body,
      commentedBy: req.userId,
    }).save();
    //send notification "user Commented On your Post"
    const notification = await new Notification({
      senderid: req.userId,
      receiverid: post.postedBy,
      event: 3,
      postid: postId,
    }).save();

    return res.status(200).json({ message: "Comment Created" });
  } catch (err) {
    res.status(404).send({ message: `${err} while Creating comment` });
  }
};
exports.createReply = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { body, parentId } = req.body;
    if (!body || !body.trim() || !parentId || !parentId.trim()) {
      return res.error(400, "Please enter All the Field!");
    }
    const comment = await new Comment({
      postId: postId,
      body: body,
      commentedBy: req.userId,
      parentId: parentId,
    }).save();

    return res.success("Reply Created", comment);
  } catch (err) {
    res.error(404, `${err}`, `${err} while Creating Reply`);
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { body } = req.body;
    const commentId = req.params.commentId;

    if (!body || !body.trim()) {
      return res.error(400, "Please enter Somethind in body Field!");
    }
    const comment = await Comment.findOneAndUpdate(
      { $and: [{ _id: commentId }, { commentedBy: req.userId }] },
      { body: body },
      { new: true }
    );
    if (comment) {
      return res.success("Reply Created", comment);
    } else {
      return res.error(400, "Only Comment writer can edit comments");
    }
  } catch (err) {
    res.error(404, `${err}`, `${err} while Updating comment`);
  }
};
exports.likeunlikeComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const comment = await Comment.findOne({ commentId });
    if (!comment) {
      res.status(400).json({ error: "comment not found!" });
    } else {
      const liked = comment.likes.by.includes(req.userId);
      const count = liked
        ? comment.likes.by.length - 1
        : comment.likes.by.length + 1;
      console.log(count);
      const option = liked ? "$pull" : "$addToSet"; //The $addToSet operator adds a value to an array unless the value is already present
      if (!liked) {
        //send like mail here
        const notification = await new Notification({
          senderid: req.userId,
          receiverid: comment.commentedBy,
          event: 2,
          commentid: comment._id,
        }).save();
      }
      const likedcomment = await Comment.updateOne(
        { commentId },
        {
          [option]: {
            "likes.by": req.userId,
          },
          $set: { "likes.total": count },
        }
      );
      const msg = liked ? "unliked" : "liked";
      return res.success(`Comment ${msg}!`, likedcomment);
    }
  } catch (err) {
    res.error(500, `${err}`, `Something Went Wrong`);
  }
};
exports.getAllComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    console.log(limit);
    const comment = await Comment.find({ postId: postId })
      .skip(offset)
      .limit(limit)
      .sort("-createdAt")
      .populate("postId")
      .populate("commentedBy");
    //   .populate("likes");
    return res.success(`Success`, comment);
  } catch (err) {
    res.error(500, `${err}`, `Something Went Wrong`);
  }
};
exports.getAllReplies = async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const comment = await Comment.find({ parentId: parentId })
      .skip(offset)
      .limit(limit)
      .sort("-createdAt");
    //   .populate("postId")
    //   .populate("commentedBy");
    //   .populate("likes");
    return res.success(`Success`, comment);
  } catch (err) {
    res.error(300, `${err}`, `Something Went Wrong`);
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findOne({ commentId });
    if (!comment) {
      return res.status(400).json({ error: "Comment not found!" });
    }
    const isParent = comment.parentId == null ? true : false;
    if (isParent) {
      await Comment.deleteMany({ parentId: _id });
    }
    await Comment.deleteOne({ _id });
    return res.success(`Comment Deleted Successfully`, comment);
  } catch (err) {
    res.error(500, `${err}`, `Something Went Wrong`);
  }
};
