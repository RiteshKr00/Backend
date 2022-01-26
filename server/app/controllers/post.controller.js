const db = require("../models");
const ImageUploadService = require("../utils/ImageUploadService");
const User = db.user;
const Post = db.post;
const Comment = db.comment;

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
    res.status(404).send({ message: `No User Found ` });
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
    return res.status(200).json({ deletedPost });
  } catch (err) {
    res.status(404).send({ message: `No post Found+${err} ` });
  }
};
