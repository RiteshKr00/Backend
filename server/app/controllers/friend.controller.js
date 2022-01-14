const db = require("../models");
const Friend = db.friend;

exports.createFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { reciever } = req.body;
    const friend = new Friend({
      senderId: req.userId,
      receiverId: reciever,
    });
    await friend.save();
    res.status(200).send({ message: "Friend Request Sent Succesfully" });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
