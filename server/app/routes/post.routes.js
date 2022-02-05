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
  app.patch(
    "/user/post/update",
    [authJwt.verifyToken],
    postcontroller.updatePost
  );
  app.delete(
    "/user/post/delete",
    [authJwt.verifyToken],
    postcontroller.deletePost
  );
  app.put(
    "/user/post/visibility",
    [authJwt.verifyToken],
    postcontroller.changeVisibilityAll
  );
  app.get("/user/post/mine", [authJwt.verifyToken], postcontroller.getAllPost);
  app.get("/user/post/feed", [authJwt.verifyToken], postcontroller.getFeed);
  app.put("/user/post/like", [authJwt.verifyToken], postcontroller.likeunlike);
  app.get(
    "/user/post/other",
    [authJwt.verifyToken],
    postcontroller.getUserPost
  );
  app.get(
    "/user/post/extended",
    [authJwt.verifyToken],
    postcontroller.getExtendedPostWithTags
  );
  app.get("/user/post/:id", [authJwt.verifyToken], postcontroller.getPost);
};
