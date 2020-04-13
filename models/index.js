const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/device-police"
);
mongoose.set("debug", true);
mongoose.connection.once("open", () => {
  console.log("connected to mongodb!");
});

module.exports.User = require("./user.js");
module.exports.Token = require("./verificationToken");
module.exports.Timer = require("./timer.js");
