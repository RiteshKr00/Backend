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

  app.put(
    "/user/post/updatecomment/:commentId",
    [authJwt.verifyToken],
    commentcontroller.updateComment
  );
  app.post(
    "/user/post/comment/likeunlike",
    [authJwt.verifyToken],
    commentcontroller.likeunlikeComment
  );
  app.get(
    "/user/post/comment/:postId",
    [authJwt.verifyToken],
    commentcontroller.getAllComments
  );
  app.get(
    "/user/post/reply/:parentId",
    [authJwt.verifyToken],
    commentcontroller.getAllReplies
  );
  app.delete(
    "/user/post/comment/delete/:commentId",
    [authJwt.verifyToken],
    commentcontroller.deleteComment
  );
  app.post(
    "/user/post/comment/:postId",
    [authJwt.verifyToken],
    commentcontroller.createComment
  );
  app.post(
    "/user/post/reply/:postId",
    [authJwt.verifyToken],
    commentcontroller.createReply
  );
};
