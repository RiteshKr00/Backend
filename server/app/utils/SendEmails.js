const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Base_Url = process.env.base_URL;

module.exports = (message) => {
  // let mailOptions = {
  //   to: email,
  //   from: "kumar@gmail.com",
  //   subject: "Reset Password",
  //   html: `
  //   <p>You requested for password reset</p>
  //   <h5>Click on this <a href="${Base_Url}/resetpassword/${token}">link</a> to reset password</h5>
  //   `,
  // };

  sgMail
    .send(message)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
