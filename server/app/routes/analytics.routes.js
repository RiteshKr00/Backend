const analyticscontroller = require("../controllers/analytics.controller");
const { authJwt } = require("../middleware");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      //Access-Control-Allow-Headers: A comma-separated list of the custom headers that are allowed to be sent
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/user/post/engagement",
    [authJwt.verifyToken],
    analyticscontroller.engagementMetrics
  );
  app.get(
    "/user/post/mostliked",
    [authJwt.verifyToken],
    analyticscontroller.mostLiked
  );
};
