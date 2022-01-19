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
  console.log("first");
  try {
    const files = req.files[0];
    const { path } = files;
    console.log(path);
    const img = await axios.post("http://localhost:8000/user/image/upload", {
      path: path,
    });
    // .then((res) => {
    //   console.log(res.data);
    // })
    // .catch((err) => console.log(err));
    const url = img.data.url;
    const user = await User.findByIdAndUpdate(req.userId, {
      $set: { pic: url },
    });

    return res.status(200).send("Profile Image uploaded SuccesFully");
  } catch (err) {
    console.log("err");
    res.status(404).send(err);
  }
};
