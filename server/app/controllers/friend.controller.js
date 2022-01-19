const db = require("../models");
const Friend = db.friend;
const User = db.user;

exports.createFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { receiver } = req.body;
    //before creating first check if such pair exist in either order
    const friend = new Friend({
      senderId: req.userId,
      receiverId: receiver,
    });
    await friend.save();
    res.status(200).send({ message: "Friend Request Sent Succesfully" });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
exports.updateRequestStatus = async (req, res) => {
  try {
    console.log(req.userId);
    //here status can be 1: "pending" 2: "accepted" 3: "rejected" 4: "blocked"
    const { status, receiver } = req.body;
    console.log(status, receiver);
    const request = await Friend.findOneAndUpdate(
      { senderId: req.userId, receiverId: receiver },
      {
        $set: { status: status },
      },
      { new: true }
    );
    //if status 2 add userID in friend list array
    if (status === 2) {
      await User.findByIdAndUpdate(req.userId, {
        $push: { friends: receiver },
      });
      await User.findByIdAndUpdate(receiver, {
        $push: { friends: req.userId },
      });
    }
    console.log(request);
    if (request) {
      res.status(200).send({
        message: "Friend Request Status Updated Succesfully",
        response: request,
      });
    } else {
      res.status(404).send({
        message: "No such Friend Exist",
      });
    }
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
exports.getFriendRequestList = async (req, res) => {
  try {
    const { status } = req.params;
    console.log(status);
    //here status can be 1: "pending" 2: "accepted" 3: "rejected" 4: "blocked"

    const list = await Friend.find({
      senderId: req.userId, //with or receiverId: req.userId
      status: status,
    });
    console.log(list);
    res.status(200).send({
      message: "Friend list with Given Status ",
      response: list,
    });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
exports.removeFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { receiver } = req.body;
    console.log(receiver);

    const friend_deleted = await Friend.findOneAndRemove({
      senderId: req.userId,
      receiverId: receiver, //also check reverse
    });
    if (friend_deleted)
      res.status(200).send({
        message: "Details of Friend Deleted ",
        response: friend_deleted,
      });
    else {
      res.status(404).send({
        message: "No such Friend Exist",
      });
    }
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};

exports.recommendFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { city } = req.body;
    //on basis of city
    const friendSuggestion = await User.find({ city: city });
    console.log(friendSuggestion);
    const x = [];
    friendSuggestion.map((friendId) => {
      x.push(friendId._id);
    });
    console.log(x);
    //Mutual friend
    const userFriendList = [];//
    const friendSuggestion2 = await Friend.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }],
      status: 1,
    });
    friendSuggestion2.map((friendId) => {
      userFriendList.push(friendId._id);
    });
    console.log(userFriendList);

    res
      .status(200)
      .send({ message1: "Ids of Friends with common city", id: x });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
