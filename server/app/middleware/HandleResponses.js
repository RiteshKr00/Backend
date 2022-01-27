module.exports = function (app) {
  app.use(function (req, res, next) {
    /**
     * (default status 200)
     * Success response
     */
    res.success = function (message, data) {
      res.status(200);
      return res.json({
        status: 200,
        message,
        data,
      });
    };

    /**
     * Custom error response
     */
    res.error = function (status, errors, message, data) {
      res.status(status);
      return res.json({
        status,
        message,
        errors,
        data,
      });
    };

    // /**
    //  * (status 403)
    //  * Bad request response
    //  */
    // res.badreq = function ({
    //   errors = {},
    //   code = 400,
    //   message = "",
    //   result = {},
    // }) {
    //   return res.status(400).error({ errors, code, message, result });
    // };

    // /**
    //  * (status 403)
    //  * Forbidden request response
    //  */
    // res.forbidden = function ({
    //   errors = {},
    //   code = 403,
    //   message = "",
    //   result = {},
    // }) {
    //   return res.status(403).error({ errors, code, message, result });
    // };

    // /**
    //  * (status 401)
    //  * Unauthorize request response
    //  */
    // res.unauth = function ({
    //   errors = {},
    //   code = 401,
    //   message = "",
    //   result = {},
    // }) {
    //   return res.status(403).error({ errors, code, message, result });
    // };

    // /**
    //  * (status 500)
    //  * Internal request response
    //  */
    // res.internal = function ({
    //   errors = {},
    //   code = 500,
    //   message = "",
    //   result = {},
    // }) {
    //   return res.status(500).error({ errors, code, message, result });
    // };

    next();
  });
};
