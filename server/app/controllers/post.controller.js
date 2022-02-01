const { post } = require("../models");
const db = require("../models");
const { notificationMail } = require("../utils/Emailprovider");
const ImageUploadService = require("../utils/ImageUploadService");
const { getPagination } = require("../utils/Pagination");
const Post = db.post;
const Friend = db.friend;
const Notification = db.notification;

exports.createPost = async (req, res) => {
  try {
    const { caption, taggedPerson, sharedBy } = req.body;
    let url, shared;
    if (sharedBy) {
      shared = true;
    }
    const tPerson = taggedPerson.split(",");
    const files = req.files[0];

    if (files) {
      const { path } = files;
      const img = await ImageUploadService(path);
      url = img.data.url;
    }
    console.log(url);

    const post = await new Post({
      caption: caption,
      pic: url,
      taggedperson: tPerson,
      postedBy: req.userId,
      shared: shared,
      sharedBy: sharedBy,
    }).save();

    return res.status(200).json({ post });
  } catch (err) {
    res.status(404).send({ message: `${err} while Creating Post` });
  }
};
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    return res.status(200).json({ post });
  } catch (err) {
    res.status(404).send({ message: `No post Found ` });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { postId, caption, taggedPerson } = req.body;
    const tPerson = taggedPerson.split(",");
    console.log(tPerson);
    //check first if user created the Post or handle it in frontend
    const upadtefield = { caption: caption, taggedperson: tPerson };
    const post = await Post.findOneAndUpdate(
      { _id: req.body.postId },
      upadtefield,
      { new: true }
    );
    console.log(post);
    return res.status(200).json({ post });
  } catch (err) {
    res.status(404).send({ message: `Error while Uploading + ${err} ` });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    console.log(postId);
    const deletedPost = await Post.findOneAndDelete({
      $and: [{ postedBy: req.userId }, { _id: postId }],
    });
    //also delete all Comments of this post
    return res.status(200).json({ deletedPost });
  } catch (err) {
    res.status(404).send({ message: `No post Found+${err} ` });
  }
};
exports.getAllPost = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    console.log(limit);
    const post = await Post.find({ postedBy: req.userId })
      .skip(offset)
      .limit(limit)
      .sort("-createdAt");
    return res.status(200).json({ post });
  } catch (err) {
    res.status(404).send({ message: `No post Found+ ${err}` });
  }
};
exports.getFeed = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const acceptedUser = await Friend.find({
      $and: [
        { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
        { status: 4 },
      ],
    }).select("receiverId -_id");
    const UserFriendId = acceptedUser.map((friend) => {
      // console.log(friend.receiverId);
      return friend.receiverId;
    });
    console.log(UserFriendId);
    const posts = await Post.find({
      postedBy: { $in: UserFriendId },
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    // .populate("postedBy");
    if (!posts || posts.length == 0) return res.error(400, "No post found!");

    return res.success("Success", posts);
  } catch (err) {
    res.status(404).send({ message: `No post Found+ ${err}` });
  }
};
exports.likeunlike = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findOne({ postId });
    console.log(post);
    if (!post) {
      res.status(400).json({ error: "Post not found!" });
    } else {
      const liked = post.likes.by.includes(req.userId);
      const count = liked ? post.likes.by.length - 1 : post.likes.by.length + 1;
      // console.log(count);
      const option = liked ? "$pull" : "$addToSet"; //The $addToSet operator adds a value to an array unless the value is already present
      if (!liked) {
        //send like mail here
        const notification = await new Notification({
          senderid: req.userId,
          receiverid: post.postedBy,
          event: 1,
          postid: post._id,
        }).save();
        await notificationMail(notification._id);
        console.log(notification);
      }
      await Post.updateOne(
        { postId },
        {
          [option]: {
            "likes.by": req.userId,
          },
          $set: { "likes.total": count },
        }
      );
      const msg = liked ? "unliked" : "liked";
      return res.status(200).json({ message: `Post ${msg}!` });
    }
  } catch (err) {
    res.status(404).send({ message: ` ${err}` });
  }
};
