const { authJwt } = require("../middleware");
const upload = require("../utils/Multer");
const userImagecontroller = require("../controllers/userImage.controller");
const { cloudinary } = require("../utils/cloudinary");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //use middleware in array *
  app.post("/user/image/upload", userImagecontroller.uploadImage);
  //   app.post(
  //     "/user/image/upload",
  //     [authJwt.verifyToken, upload.array("image")],
  //     userImagecontroller.uploadImage
  //   );
  //   app.get("/user/search", [authJwt.verifyToken], usercontroller.searchUser);
};
