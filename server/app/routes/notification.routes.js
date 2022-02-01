const notificationcontroller = require("../controllers/notification.controller");
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
  app.get(
    "/user/notification",
    [authJwt.verifyToken],
    notificationcontroller.getAllNotification
  );
  app.put(
    "/user/notification/read",
    [authJwt.verifyToken],
    notificationcontroller.markAsReadAll
  );
  app.put(
    "/user/notification/read/:notificationid",
    [authJwt.verifyToken],
    notificationcontroller.markAsRead
  );
  app.get(
    "/user/notification/:id",
    [authJwt.verifyToken],
    notificationcontroller.getNotificationById
  );
  //   app.get("/user/:id", [authJwt.verifyToken], usercontroller.getUser);
};
