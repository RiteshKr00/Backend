const usercontroller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");
const upload = require("../utils/Multer");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //use middleware in array *
  app.get("/user/search", [authJwt.verifyToken], usercontroller.searchUser);

  app.put(
    "/user/changestatus",
    [authJwt.verifyToken],
    usercontroller.changeStatus
  );
  app.put(
    "/user/friendvisibility",
    [authJwt.verifyToken],
    usercontroller.friendVisibility
  );
  app.post(
    "/user/profileimg",
    [authJwt.verifyToken, upload.array("image", 1)], //can be used send Multiple files
    usercontroller.uploadProfilePic
  );
  app.get("/user/:id", [authJwt.verifyToken], usercontroller.getUser);
};
