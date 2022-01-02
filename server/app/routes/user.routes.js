const usercontroller = require("../controllers/user.controller");
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
    app.get("/user/:id", [authJwt.verifyToken], usercontroller.getUser);
    app.get("/usersearch", [authJwt.verifyToken], usercontroller.searchUser);
   
  };
   