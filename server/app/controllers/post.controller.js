const db = require("../models");
const User = require("../models/user.model");
const { notificationMail } = require("../utils/Emailprovider");
const ImageUploadService = require("../utils/ImageUploadService");
const { getPagination } = require("../utils/Pagination");
const Post = db.post;
const Friend = db.friend;
const Notification = db.notification;
const Tags = db.tags;
exports.createPost = async (req, res) => {
  try {
    const { caption, taggedPerson, originalAuthor, tags } = req.body;
    let url, shared;
    //handle sharing field in frontend or seperate sare
    if (originalAuthor) {
      shared = true;
    }
    const tPerson = taggedPerson.split(",");
    const postTags = tags.split(",");
    const files = req.files[0];
//uncomment to post image
    // if (files) {
    //   const { path } = files;
    //   const img = await ImageUploadService(path);
    //   url = img.data.url;
    // }
    console.log(url);
    //update doc in bulk in one request
    var bulkUpdateOps = postTags.map(function (t) {
      return {
        updateOne: {
          filter: { tag: t },
          update: { $inc: { total: 1 }, userid: req.userId },
          upsert: true,
        },
      };
    });
    const upddateTagCount = await Tags.bulkWrite(bulkUpdateOps);
    console.log(upddateTagCount);
    const post = await new Post({
      caption: caption,
      pic: "url",
      taggedperson: tPerson,
      tags: postTags,
      postedBy: req.userId,
      shared: shared,
      originalAuthor: originalAuthor,
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
//to get other user post
exports.getUserPost = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    console.log(limit);
    console.log(user.status);
    if (user.status === "public") {
      const post = await Post.find({ postedBy: user._id })
        .skip(offset)
        .limit(limit)
        .sort("-createdAt");
      return res.status(200).json({ post });
    } else if (user.status === "private") {
      //check if user is a friend of requester
      console.log("here");
      const isFriend = await Friend.findOne({
        $and: [
          { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
          { $or: [{ senderId: user._id }, { receiverId: user._id }] },
          { status: 4 },
        ],
      });
      console.log(isFriend);
      if (isFriend) {
        const post = await Post.find({ postedBy: user._id })
          .skip(offset)
          .limit(limit)
          .sort("-createdAt");
        return res.status(200).json({ post });
      } else {
        return res.status(200).json({ message: "User has private status" });
      }
    }
  } catch (err) {
    res.status(500).send({ message: `Something went wrong+${err} ` });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { postId, caption, taggedPerson, tags } = req.body;
    const tPerson = taggedPerson.split(",");
    const hashTags = tags.split(",");
    console.log(tPerson);
    //check first if user created the Post or handle it in frontend
    const upadtefield = {
      caption: caption,
      taggedperson: tPerson,
      tags: hashTags,
    };
    const post = await Post.findOneAndUpdate({ _id: postId }, upadtefield, {
      new: true,
    });
    console.log(post);
    return res.status(200).json({ post });
  } catch (err) {
    res.status(404).send({ message: `Error while Updating + ${err} ` });
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
    console.log(postId);
    const post = await Post.findById(postId).populate("postedBy");
    console.log(post);
    if (!post) {
      res.status(400).json({ error: "Post not found!" });
    } else {
      const liked = post.likes.by.includes(req.userId);
      const count = liked ? post.likes.by.length - 1 : post.likes.by.length + 1;
      console.log(liked);
      const option = liked ? "$pull" : "$addToSet"; //The $addToSet operator adds a value to an array unless the value is already present
      const notification = post.postedBy.receivenotification;
      const postTags = post.tags;
      // uncomment
      if (!liked) {
        //update tags count of a user
        var bulkUpdateOps = postTags.map(function (t) {
          return {
            updateOne: {
              filter: { tag: t },
              update: { $inc: { total: 1 }, userid: req.userId },
              upsert: true,
            },
          };
        });
        const upddateTagCount = await Tags.bulkWrite(bulkUpdateOps);
        console.log(upddateTagCount);
        //send like mail here
        if (notification.dashboard) {
          const notify = await new Notification({
            senderid: req.userId,
            receiverid: post.postedBy,
            event: 1,
            postid: post._id,
          }).save();

          if (notification.email) await notificationMail(notify._id);
          console.log(notify);
        }
      }
      // const newPost = await Post.updateOne(
      //   { postId },
      //   {
      //     [option]: {
      //       "likes.by": req.userId,
      //       likeanalytics: { userid: req.userId },
      //     },
      //     $set: { "likes.total": count },
      //   }
      // );
      const newPost = await Post.findByIdAndUpdate(postId, {
        [option]: {
          "likes.by": req.userId,
          likeanalytics: { userid: req.userId },
        },
        $set: { "likes.total": count },
      });

      console.log(newPost);
      const msg = liked ? "unliked" : "liked";
      return res.status(200).json({ message: `Post ${msg}!` });
    }
  } catch (err) {
    res.status(404).send({ message: ` ${err}` });
  }
};
exports.changeVisibilityAll = async (req, res) => {
  try {
    const { visible } = req.query;
    console.log(typeof visible);
    if (visible === "private") {
      console.log("first");
    } else {
      console.log("second");
    }

    return res.success(`Success`);
  } catch (err) {
    res.error(300, `${err}`, `Something Went Wrong`);
  }
};
exports.changeVisibility = async (req, res) => {
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
    res.error(500, `${err}`, `Something Went Wrong`);
  }
};
exports.getExtendedPostWithTags = async (req, res) => {
  try {
    const { page, size } = req.query;
    console.log(page, size);
    const { limit, offset } = getPagination(page, size);
    console.log(limit, offset);
    const likedTags = await Tags.find({ userid: req.userId })
      .sort("-total")
      .limit(5); //first 5 most liked tags only
    console.log(likedTags);
    let tags = likedTags.map(({ tag }) => tag);
    console.log(tags);

    const posts = await Post.find({ tags: { $in: tags } })
      .sort({
        "likes.total": -1,
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    if (!posts || posts.length == 0) return res.error(400, "No post found!");

    return res.success("Success", posts);
  } catch (err) {
    res.error(500, `${err}`, `Something Went Wrong`);
  }
};
