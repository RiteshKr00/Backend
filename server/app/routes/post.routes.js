const postcontroller = require("../controllers/post.controller");
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

  app.post(
    "/user/post/create",
    [authJwt.verifyToken, upload.array("image", 1)],
    postcontroller.createPost
  );
};
