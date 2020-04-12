const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// storing password
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass;
    return next();
  } catch (err) {
    return next({ status: 400, message: "user account operation failed" }); //  passing an error to next will trigger the error handler middleware
  }
});

// method for comparing two password
userSchema.methods.comparePassword = async function (passwordInput, next) {
  try {
    let isMatch = await bcrypt.compare(passwordInput, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
