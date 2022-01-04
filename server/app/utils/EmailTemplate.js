const Base_Url = process.env.base_URL;
const Sender_email = process.env.Sender_email;

exports.Verification = (email, token) => {
  let mailOptions = {
    to: email,
    from: Sender_email,
    subject: "Verify your Email",
    html: `
        <p>Verify email to reset password in case you forget</p>
        <h3>Click on this <a href="${Base_Url}/verify/${token}">link</a> to verify Email</h3>
        `,
  };
  return mailOptions;
};

exports.ResetPassword = (email, token) => {
  let mailOptions = {
    to: email,
    from: Sender_email,
    subject: "Reset Password",
    html: `
      <p>You requested for password reset</p>
      <h5>Click on this <a href="${Base_Url}/resetpassword/${token}">link</a> to reset password</h5>
      `,
  };
  return mailOptions;
};
