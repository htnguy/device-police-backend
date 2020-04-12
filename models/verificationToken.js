const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, expires: 3600, default: Date.now },
});

const tokenModel = mongoose.model("VerificationToken", tokenSchema);
module.exports = tokenModel;
