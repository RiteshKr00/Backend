const db = require("../models");
const ImageUploadService = require("../utils/ImageUploadService");
const { getPagination } = require("../utils/Pagination");
const Post = db.post;
const Comment = db.comment;
exports.createComment = async (req, res) => {
  try {
    const { body } = req.body;
    const postId = req.params.postId;
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

    return res.status(200).json({ message: "Comment Created" });
  } catch (err) {
    res.status(404).send({ message: `${err} while Creating comment` });
  }
};
exports.createReply = async (req, res) => {
  try {
    const { body } = req.body;
    const postId = req.params.postId;
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

    return res.status(200).json({ message: "Comment Created" });
  } catch (err) {
    res.status(404).send({ message: `${err} while Creating comment` });
  }
};
