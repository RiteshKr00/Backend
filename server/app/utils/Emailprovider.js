const axios = require("axios");
const Email_Url = process.env.email_URL;
const Base_Url = process.env.base_URL;
const Sender_email = process.env.Sender_email;

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
    from: "kumar@gmail.com",
    subject: "Reset Password",
    html: `
          <p>You requested for password reset</p>
          <h5>Click on this <a href="${Base_Url}/resetpassword/${token}">link</a> to reset password</h5>
          `,
  };
};
module.exports = {
  sendVerificationMail,
  resetPassword,
};

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const Base_Url = process.env.base_URL;
// module.exports = (message) => {
// let mailOptions = {
//   to: email,
//   from: "kumar@gmail.com",
//   subject: "Reset Password",
//   html: `
//   <p>You requested for password reset</p>
//   <h5>Click on this <a href="${Base_Url}/resetpassword/${token}">link</a> to reset password</h5>
//   `,
// };

//   sgMail
//     .send(message)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
