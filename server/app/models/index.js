const db = {};

db.user = require("./user.model");
db.friend = require("./friend.model");
db.userImages = require("./userImages.model");
db.post = require("./post.model");
db.comment = require("./comment.model");
db.notification = require("./notification.model");
db.tags = require("./tags.model");
module.exports = db;
