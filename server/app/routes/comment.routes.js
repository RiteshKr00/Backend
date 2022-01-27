const commentcontroller = require("../controllers/comment.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/user/post/comment/:postId",
    [authJwt.verifyToken],
    commentcontroller.createComment
  );
  app.post(
    "/user/post/reply/:postId",
    [authJwt.verifyToken],
    commentcontroller.createComment
  );
};
