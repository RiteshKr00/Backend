const db = require("../models");
const Friend = db.friend;

exports.createFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { receiver } = req.body;
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
      senderId: req.userId,
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
      receiverId: receiver,
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
