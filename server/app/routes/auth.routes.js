const authcontroller = require("../controllers/auth.controller");
const { verifySignUp } = require("../middleware"); //no need to go one folder next due to index file

/// NEW - Add CORS headers - see https://enable-cors.org/server_expressjs.html
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      //Access-Control-Allow-Headers: A comma-separated list of the custom headers that are allowed to be sent
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/ping", (req, res) => {
    res.send({ message: "connected" });
  });
  app.post(
    "/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    authcontroller.signup
  );

  app.post("/auth/signin", authcontroller.signin);
  app.post("/auth/forgot_password", authcontroller.sendResetpassword);
  app.post("/auth/setnewpassword", authcontroller.newPassword);
  app.get("/auth/verifyemail", authcontroller.verifyEmail);
};
