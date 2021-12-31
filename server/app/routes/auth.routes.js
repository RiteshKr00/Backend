const controller = require("../controllers/auth.controller");

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
  
};
