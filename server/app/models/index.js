const db = {};

db.user = require("./user.model");
db.friend = require("./friend.model");
db.userImages = require("./userImages.model");
module.exports = db;
