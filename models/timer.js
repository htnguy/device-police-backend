const mongoose = require("mongoose");

const timerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeout: { type: String, required: true },
  isRunning: { type: Boolean, default: false, require: true },
});

timerSchema.set("autoIndex", false);

const timerModel = mongoose.model("Timer", timerSchema);

module.exports = timerModel;
