const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  resetPassword,
  sendVerificationMail,
} = require("../utils/Emailprovider");
const RandomToken = require("../utils/RandomToken");
const { default: axios } = require("axios");
const JWT = process.env.JWT_SEC;

exports.signup = async (req, res) => {
  //save to db
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.status(400).send({ error: "please add all the fields" });
    }
    const token = RandomToken();

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
      city: req.body.city,
      resetToken: token,
      expireToken: Date.now() + 3600000 * 24 * 15, //15 days,
    });
    await user.save();
    sendVerificationMail(req.body.email, token);
    res
      .status(200)
      .send({ message: "User was registered successfully! Verify Email" });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password || !username) {
      return res.status(400).send({ error: "please add all the fields" });
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    //compare password
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    //sign token
    var token = jwt.sign({ id: user.id }, JWT, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

exports.sendResetpassword = async (req, res) => {
  try {
    const token = RandomToken();
    console.log(token);
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { resetToken: token, expireToken: Date.now() + 3600000 } }, //1hr
      { useFindAndModify: false }
    ).select("-password");
    if (!user) {
      return res
        .status(422)
        .json({ error: "User dont exists with that email" });
    }
    resetPassword(req.body.email, token);
    res.send("Password Reset Link Sent");
  } catch (err) {
    res.status(500).send({ message: `Email Not Sent ${err} ` });
  }
};
exports.newPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const user = await User.findOneAndUpdate(
      { resetToken: token, expireToken: { $gt: Date.now() } },
      {
        $set: {
          password: await bcrypt.hash(password, 8),
          resetToken: null,
          expireToken: null,
        },
      },
      { useFindAndModify: false } //'useFindAndModify': true by default.
      // Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
    ).select("-password");
    if (!user) {
      return res.status(422).json({ error: "Try again token/session expired" });
    }
    res.send("Password Updated");
  } catch (err) {
    res.status(500).send({ message: `Password not Updated ${err} ` });
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOneAndUpdate(
      { resetToken: token, expireToken: { $gt: Date.now() } },
      {
        $set: {
          verified: true,
          resetToken: null,
          expireToken: null,
        },
      },
      { useFindAndModify: false } //'useFindAndModify': true by default.
      // Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
    ).select("-password");
    if (!user) {
      return res.status(422).json({ error: "Try again token/session expired" });
    }
    res.send("Email Verified");
  } catch (err) {
    res.status(500).send({ message: `Email not Verified ${err} ` });
  }
};
