const mongoose = require("mongoose");
const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SEC;

exports.signup = async (req, res) => {
  //save to db
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.status(400).send({ error: "please add all the fields" });
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    });
    await user.save();

    res.status(200).send({ message: "User was registered successfully!" });
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
