const axios = require("axios");
const Email_Url = process.env.email_URL;
const Base_Url = process.env.base_URL;
const Sender_email = process.env.Sender_email;
const db = require("../models");
const Notification = db.notification;

const sendVerificationMail = async (email, token) => {
  const data = {
    to: email,
    from: Sender_email,
    subject: "Verify your Email",
    html: `
          <p>Verify email to reset password in case you forget</p>
          <h3>Click on this <a href="${Base_Url}/verifyemail/${token}">link</a> to verify Email</h3>
          `,
  };
  const maildata = axios.post(Email_Url, {
    data: data,
  });
  // .then((res) => {
  //   console.log(res.data);
  // })
  // .catch((err) => console.log(err));
  return maildata;
};
const resetPassword = async (email, token) => {
  const data = {
    to: email,
    from: Sender_email,
    subject: "Reset Password",
    html: `
          <p>You requested for password reset</p>
          <h5>Click on this <a href="${Base_Url}/resetpassword/${token}">link</a> to reset password</h5>
          `,
  };
  const maildata = axios.post(Email_Url, {
    data: data,
  });
};

const notificationMail = async (notificationId) => {
  const notification = await Notification.findOne({ _id: notificationId })
    .populate("senderid")
    .populate("receiverid");
  console.log(notification);

  console.log(notificationId);
  let data;
  let message = "";
  if (notification) {
    const event = notification.event;
    const user1 = notification.senderid.username;
    const user2 = notification.receiverid.username;
    const postid = notification.postid;
    const commentid = notification.commentid;

    switch (event) {
      //Liked Post
      case 1:
        data = {
          to: notification.senderid.email,
          subject: "Post Liked",
          from: Sender_email,
          //Write a good Mail and include frontend url
          html: `
          <h1> ${user1} liked your post</h1>
          <p> ${user1} (UserID)-${notification.senderid._id} liked your post having (ID)-${postid}</p>`,
        };
        break;
      //Liked comment
      case 2:
        data = {
          to: notification.senderid.email,
          subject: "Comment Liked",
          from: Sender_email,
          //Write a good Mail and include frontend url
          html: `
        <h1> ${user1} liked your Comment</h1>
        <p> ${user1} (UserID)-${notification.senderid._id} liked your comment having (ID)-${commentid}</p>`,
        };
        break;
      //Commented
      case 3:
        data = {
          to: notification.senderid.email,
          subject: "Comment Liked",
          from: Sender_email,
          //Write a good Mail and include frontend url
          html: `
          <h1> ${user1} commented on your Post </h1>
          <p> ${user1} (UserID)-${notification.senderid._id} commented on your Post  having (ID)-${postid}</p>`,
        };
        break;
      //Sent friend request
      case 4:
        data = {
          to: notification.senderid.email,
          subject: "Comment Liked",
          from: Sender_email,
          //Write a good Mail and include frontend url
          html: `
          <h1> ${user1} Sent you a Friend Request  </h1>
          <p> ${user1} (UserID)-${notification.senderid._id} Sent you a Friend Request </p>`,
        };
        break;
      //Accept Friend request
      case 5:
        data = {
          to: notification.senderid.email,
          subject: "Comment Liked",
          from: Sender_email,
          //Write a good Mail and include frontend url
          html: `
            <h1> ${user1} Accepted your Friend Request   </h1>
            <p> ${user1} (UserID)-${notification.senderid._id} Accepted your Friend Request  </p>`,
        };

        break;

      default:
        console.log("Invalid Request");
        break;
    }
  }
  console.log(data);
  //uncomment while sending Mail
  // const maildata = axios.post(Email_Url, {
  //   data: data,
  // });
};
module.exports = {
  sendVerificationMail,
  resetPassword,
  notificationMail,
};
