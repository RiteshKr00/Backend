const db = {};

db.user = require("./user.model");
db.friend = require("./friend.model");
db.userImages = require("./userImages.model");
db.post = require("./post.model");
db.comment = require("./comment.model");
module.exports = db;
