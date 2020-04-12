const router = require("express").Router();
const db = require("../models/");
const twilioHelper = require("../helpers/twilio.js");
const jwt = require("jsonwebtoken");
// creating a new user when the user submits thw registration form
router.post("/signup", async (req, res, next) => {
  try {
    const existingUser = await db.User.findOne({ phone: req.body.phone });
    if (existingUser) {
      return next({
        status: 403,
        message: "phone number already associated with an account",
      });
    }
    // if user does not exists, create the user
    const newUser = await db.User.create(req.body);
    const token = await db.Token.create({
      userId: newUser._id,
      token: Math.floor(100000 + Math.random() * 900000),
    });
    // sending the token to the user through the sms
    await twilioHelper.send(
      newUser.phone,
      `Thanks for being patient! Here is your shiny verification code: ${token.token} . Hurry it expires in 1hr!`
    );
    next("verification code sent!");
  } catch (err) {
    console.log(err);
    next({ status: 400, message: "failed to signup" });
  }
});

router.post("/resendverificationcode", async (req, res, next) => {
  try {
    const user = await db.User.findOne({ phone: req.body.phone });
    if (!user) {
      next({
        status: 400,
        message:
          "unrecognized phone number. please register the phone number first",
      });
    }
    if (user.isVerified) {
      return next("user is already verified");
    }
    const token = await db.Token.create({
      userId: user._id,
      token: Math.floor(100000 + Math.random() * 900000),
    });
    // sending the token to the user through the sms
    await twilioHelper.send(
      user.phone,
      `Thanks for being patient! Here is your shiny verification code: ${token.token} . Hurry it expires in 1hr!`
    );
    next("verification code sent!");
  } catch (error) {
    console.log(error);
    next({ status: 400, message: "failed to send verification code" });
  }
});

// confirming the user when the user enters the verification code
router.post("/confirm", async (req, res, next) => {
  try {
    const token = await db.Token.findOne({ token: req.body.token });
    if (!token) {
      return next({ status: 400, message: "code has expired" });
    }
    const user = await db.User.findById(token.userId);
    if (user) {
      if (!user.isVerified) {
        user.isVerified = true;
        user.save();
        token.remove();
        return next("account confirmed!");
      } else {
        return next("already verified!");
      }
    }
    next({ status: 400, message: "verification code does not match" });
  } catch (err) {
    next({ status: 400, message: "failed to verify user" });
  }
});

// sign in

router.post("/signin", async (req, res, next) => {
  try {
    const user = await db.User.findOne({ phone: req.body.phone });
    if (!user.isVerified) {
      return next("user is not verified");
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const jwtToken = await jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY
      );
      return next({ jwt: jwtToken, message: "sign in success!" });
    }
  } catch (err) {
    console.log(err);
    next({ status: 400, message: "failed to sign in" });
  }
});

module.exports = router;
