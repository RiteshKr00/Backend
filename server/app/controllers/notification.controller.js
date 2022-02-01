const db = require("../models");
const Notification = db.notification;

exports.getAllNotification = async (req, res) => {
  try {
    const user = req.userId;
    const notification = await Notification.find({ receiverid: user }).sort({
      createdAt: -1,
    });

    return res.success("All Notifications", notification);
  } catch (err) {
    res.error(500, `${err}`, `${err} Something Went Wrong`);
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const user = req.userId;
    const notification = await Notification.findOne({ _id: req.params.id })
      .populate("senderid")
      .populate("receiverid");
    console.log(notification);
    let message = "";
    if (notification) {
      const event = notification.event;
      const user1 = notification.senderid.username;
      const user2 = notification.receiverid.username;
      const postid = notification.postid;
      const commentid = notification.commentid;
      console.log(user1 + user2);

      switch (event) {
        //Liked Post
        case 1:
          message =
            user1 +
            " (UserID)-" +
            notification.senderid._id +
            " liked your post having (ID)-" +
            postid;
          break; //Liked Post
        case 2:
          message =
            user1 +
            " (UserID)-" +
            notification.senderid._id +
            " liked your comment having (ID)- " +
            commentid;
          break;
        case 3:
          message =
            user1 +
            " (UserID)-" +
            notification.senderid._id +
            " commented on your Post  having (ID)- " +
            postid;
          break;
        case 4:
          message =
            user1 +
            " (UserID)-" +
            notification.senderid._id +
            " Sent you a Friend Request ";
          break;
        case 5:
          message =
            user1 +
            " (UserID)-" +
            notification.senderid._id +
            " Accepted your Friend Request ";
          break;

        default:
          console.log("Invalid Request");
          break;
      }
    }
    return res.success("Notifications", message);
  } catch (err) {
    res.error(500, `${err}`, `${err} Something Went Wrong`);
  }
};

exports.markAsReadAll = async (req, res) => {
  try {
    const user = req.userId;
    const notification = await Notification.updateMany(
      { receiverid: user },
      {
        $set: { seen: true }, //read
      },
      { new: true }
    );

    return res.success("Mark As read Successfully", notification);
  } catch (err) {
    res.error(500, `${err}`, `${err} Something Went Wrong`);
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const user = req.userId;
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationid,
      { seen: true }, //read
      { new: true }
    );

    return res.success("Mark As read successfully", notification);
  } catch (err) {
    res.error(500, `${err}`, `${err} Something Went Wrong`);
  }
};
