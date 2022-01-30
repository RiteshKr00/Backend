const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Base_Url = process.env.base_URL;

exports.emailmessage = (email, from, subject, html) => {
  let mailOptions = {
    to: email,
    from: from,
    subject: subject,
    html: html,
  };
  return mailOptions;
};

exports.sendMail = (message) => {
  sgMail
    .send(message)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
