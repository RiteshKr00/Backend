const friendcontroller = require("../controllers/friend.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //use middleware in array *
  app.post("/friend/create", [authJwt.verifyToken], friendcontroller.createFriend);
};
