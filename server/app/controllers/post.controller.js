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
