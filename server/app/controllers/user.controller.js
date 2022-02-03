const { default: axios } = require("axios");

const db = require("../models");
const User = db.user;

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    return res.status(200).json({ user });
  } catch (err) {
    res.status(404).send({ message: `No User Found ` });
  }
};

exports.searchUser = async (req, res) => {
  try {
    //Use the constructor function when you know the regular expression pattern will be changing,
    const userPattern = new RegExp(req.body.query);
    console.log(req.body.query);
    const user = await User.find({
      $or: [
        { username: { $regex: userPattern, $options: "i" } },
        { email: { $regex: userPattern, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(100);

    return res.status(200).json({ user });
  } catch (err) {
    console.log("err");
    res.status(404).send(err);
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    console.log("first");
    const files = req.files[0];
    const { path } = files;
    const img = await ImageUploadService(path);
    const url = img.data.url;
    const user = await User.findByIdAndUpdate(req.userId, {
      $set: { pic: url },
    });
    console.log("first");
    return res.status(200).send("Profile Image uploaded SuccesFully");
  } catch (err) {
    console.log("err");
    res.status(404).send(err);
  }
};
exports.changeStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const newstatus = user.status == "public" ? "private" : "public";
    const updated = await User.findByIdAndUpdate(
      req.userId,
      {
        status: newstatus,
      },
      { new: true }
    );
    return res.success("Status Changed Succesfully", updated);
  } catch (err) {
    console.log("err");
    res.status(404).send(err);
  }
};
exports.friendVisibility = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const newstatus = user.friendvisibility ? false : true;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      {
        friendvisibility: newstatus,
      },
      { new: true }
    );
    return res.success("Status Changed Succesfully", updated);
  } catch (err) {
    console.log("err");
    res.status(404).send(err);
  }
};
