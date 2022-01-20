const db = require("../models");
const Friend = db.friend;
const User = db.user;

exports.createFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { receiver } = req.body;
    //before creating first check if user is blocked or such pair exist in either order
    const blocked = await Friend.find({
      $and: [
        { $or: [{ senderId: receiver }, { receiverId: req.userId }] },
        { status: { $eq: 3 } },
      ],
    });
    if (blocked.length) {
      return res.status(400).send({ message: "User is Blocked" });
    }
    const exist = await Friend.find({
      $and: [
        { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
        { $or: [{ senderId: receiver }, { receiverId: receiver }] },
      ],
    });
    console.log(exist);
    console.log(blocked);
    if (exist.length) {
      return res.status(400).send({ message: "Request is already Sent" });
    }
    // user1 < --user2;
    const friendRequest1 = new Friend({
      senderId: req.userId,
      receiverId: receiver,
      status: 2, //Pending
    });
    await friendRequest1.save();
    //user1--->user2
    const friendRequest2 = new Friend({
      receiverId: req.userId,
      senderId: receiver,
      status: 1, //Requested
    });
    await friendRequest2.save();

    res.status(200).send({ message: "Friend Request Sent Succesfully" });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    console.log(req.userId);
    //here status can be  // 1: "Requested" 2: "Pending" 3: "Blocked"  4: "Accepted"
    const { receiver } = req.body;
    console.log(receiver);
    const request = await Friend.updateMany(
      {
        $and: [
          { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
          { $or: [{ senderId: receiver }, { receiverId: receiver }] },
        ],
      },
      {
        $set: { status: 4 }, //Accepted
      },
      { new: true }
    );

    console.log(request.matchedCount);
    if (request.matchedCount) {
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
//can be used to unfriend
exports.rejectRequest = async (req, res) => {
  try {
    console.log(req.userId);
    //here status can be  // 1: "Requested" 2: "Pending" 3: "Blocked"  4: "Accepted"

    const { receiver } = req.body;
    console.log(receiver);
    const request = await Friend.deleteMany({
      $and: [
        { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
        { $or: [{ senderId: receiver }, { receiverId: receiver }] },
      ],
    });

    console.log(request.deletedCount);
    if (request.deletedCount) {
      res.status(200).send({
        message: "Friend Request Rejected Updated Succesfully",
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
//Assumed not any request exist
exports.blockUnblockRequest = async (req, res) => {
  try {
    console.log(req.userId);
    //here status can be  // 1: "Requested" 2: "Pending" 3: "Blocked"  4: "Accepted"

    const { receiver } = req.body;
    console.log(receiver);
    //check if already Blocked
    const blocked = await Friend.find({
      $and: [
        { $or: [{ senderId: req.userId }, { receiverId: receiver }] },
        { status: { $eq: 3 } },
      ],
    });
    console.log(blocked);
    if (blocked.length) {
      console.log("User is Blocked unblock him");
      const unblock = await Friend.findOneAndRemove({
        $and: [
          { $or: [{ senderId: req.userId }, { receiverId: receiver }] },
          { status: { $eq: 3 } },
        ],
      });
      console.log(unblock);
      return res.status(200).send({
        message: "User unBlocked Succesfully",
        // response: unblock,
      });
    } else {
      const blockRequest = new Friend({
        senderId: req.userId,
        receiverId: receiver,
        status: 3, //Blocked
      });
      const user = await blockRequest.save();
      console.log(user);
      if (user) {
        res.status(200).send({
          message: "User Blocked Succesfully",
          response: user,
        });
      } else {
        res.status(404).send({
          message: "No such Friend Exist",
        });
      }
    }
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
exports.updateRequestStatus = async (req, res) => {
  try {
    console.log(req.userId);
    //here status can be  // 1: "Requested" 2: "Pending" 3: "Blocked"  4: "Accepted"

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
    //here status can be  // 1: "Requested" 2: "Pending" 3: "Blocked"  4: "Accepted"
    console.log(req.userId);
    let list = [];
    switch (status) {
      //Requested

      case "1":
        console.log("first");
        const requestedUser = await Friend.find({
          $and: [{ senderId: req.userId }, { status: status }],
        }).populate("senderId", "username email");
        console.log(requestedUser);
        break;
      //pending
      case "2":
        const pendingUser = await Friend.find({
          $and: [{ senderId: req.userId }, { status: status }],
        }).populate("senderId", "username email");
        console.log(pendingUser);
        list = pendingUser;

        break;
      //blocked
      case "3":
        const blockedUser = await Friend.find({
          $and: [{ senderId: req.userId }, { status: status }],
        });
        console.log(blockedUser);
        list = blockedUser;
        break;
      //friend
      case "4":
        const acceptedUser = await Friend.find({
          $and: [
            { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
            { status: status },
          ],
        });
        console.log(acceptedUser);
        list = acceptedUser;

        break;

      default:
        console.log("Invalid Request");
        break;
    }
    // const list = await Friend.find({
    //   $and: [
    //     { $or: [{ senderId: req.userId }, { receiverId: req.userId }] },
    //     { status: 4 },
    //   ],
    // });
    // console.log(list);
    res.status(200).send({
      message: "User list with Given Status ",
      response: list,
    });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
// exports.removeFriend = async (req, res) => {
//   try {
//     console.log(req.userId);
//     const { receiver } = req.body;
//     console.log(receiver);

//     const friend_deleted = await Friend.findOneAndRemove({
//       senderId: req.userId,
//       receiverId: receiver, //also check reverse
//     });
//     if (friend_deleted)
//       res.status(200).send({
//         message: "Details of Friend Deleted ",
//         response: friend_deleted,
//       });
//     else {
//       res.status(404).send({
//         message: "No such Friend Exist",
//       });
//     }
//   } catch (err) {
//     res.status(500).send({ message: `Something Went Wrong ${err} ` });
//   }
// };

exports.recommendFriend = async (req, res) => {
  try {
    console.log(req.userId);
    const { city } = req.body;
    //on basis of city
    
    // const friendSuggestion = await User.find({
    //   $and: [{ city: city }, { _id: { $nin: req.userId } }],
    // });
    // // console.log(friendSuggestion);
    // // const x = [];
    // // friendSuggestion.map((friendId) => {
    // //   x.push(friendId._id);
    // // });
    // // console.log(x);

    //Mutual Friend
    let x = [];
    let recommended = [];
    const friend = await Friend.find({
      $and: [{ senderId: req.userId }, { status: 4 }],
    });
    // console.log(friend);
    const myfriend = friend.map((friend) => {
      // console.log(friend.receiverId);
      return friend.receiverId;
    });
    // console.log(myfriend);
    //Iterate my friend's friend and store it in a set
    myfriend.forEach(async (user) => {
      // console.log(user);
      const otherUserFriend = await Friend.find({
        $and: [
          { senderId: user },
          { status: 4 },
          {
            $and: [
              { receiverId: { $nin: req.userId } },
              { receiverId: { $nin: myfriend } },
            ],
          },
        ],
      });
      const otherUserFriendId = otherUserFriend.map((friend) => {
        // console.log(friend.receiverId);
        return friend.receiverId;
      });
      // console.log(otherUserFriendId);
      recommended = [...new Set([...recommended, ...otherUserFriendId])];
      console.log(recommended);
    });
    console.log(recommended);
    //pass value of variable in aync statement
    res
      .status(200)
      .send({ message1: "Ids of Mutual Friends  ", response: recommended });
  } catch (err) {
    res.status(500).send({ message: `Something Went Wrong ${err} ` });
  }
};
