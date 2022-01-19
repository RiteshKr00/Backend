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
  app.get("/user/:id", [authJwt.verifyToken], usercontroller.getUser);
  app.get("/user/search", [authJwt.verifyToken], usercontroller.searchUser);
  app.post(
    "/user/image/upload",
    [authJwt.verifyToken, upload.array("image", 1)], //can be used send Multiple files
    usercontroller.uploadProfilePic
  );
};
