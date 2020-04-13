const router = require("express").Router();
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twilioHelper = require("../helpers/twilio");
const { ensureCorrectUser } = require("../middleware/auth.middleware.js");
const db = require("../models/");
var TimerBuffers = require("../timerBuffers.js");
const activityAPI = require("../helpers/activityAPI.js");
// routes for twilio webhooks to send incoming message

router.post("/receive", async (req, res, next) => {
  try {
    const twiml = new MessagingResponse();
    let message;
    const { Body, From } = req.body;
    console.log("body and from ", Body, From);
    const existingUser = await db.User.findOne({ phone: From });
    if (!existingUser) {
      switch (Body.toLowerCase()) {
        case "yes":
          await db.User.create({ phone: From, password: "testing" });
          message =
            "Welcome! What do you want to do today? \n  reply: 'new' to set a new timer. 'reset' reset timer ";
          break;
        case "no":
          message =
            "that is too bad. Have a great day and use your device responsibly! Too much of a good things is is a bad thing ";
          break;
        default:
          message =
            "looks like you don't have an account yet. Want to join? reply yes or no";
          break;
      }
    } else {
      if (!isNaN(Body)) {
        // it is a number
        const minutes = Number(Body);
        TimerBuffers[existingUser._id] = setTimeout(() => {
          activityAPI.getRandomActivity().then((ac) => {
            twilioHelper.send(
              existingUser.phone,
              `Time to get off your device now. Try this out: ${ac}`
            );
          });
        }, minutes * 60 * 1000);
        message = `your timer has been set for ${minutes} minutes`;
      } else {
        switch (Body.toLowerCase()) {
          case "new":
            message =
              "How long do you want to be possessed by your device before we wake you up? (enter a value for the number of minutes)";
            break;
          case "reset":
            clearTimeout(TimerBuffers[existingUser._id]);
            delete TimerBuffers[existingUser._id];
            message = "I gotchu. Your timer has been reset";
            break;
          default:
            message =
              "Welcome back! What do you want to do today? \n  reply: 'new' to set a new timer. 'reset' reset timer ";
            break;
        }
      }
    }

    twiml.message(message);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.log("twilio error", error);
  }
});

// routes for sending a sms from the twilio phone number to the provided phone number in the request body
router.post("/:userId/send", ensureCorrectUser, async (req, res, next) => {
  try {
    const response = await twilioHelper.send(req.body.phone, req.body.message);
    next("message sent!");
  } catch (err) {
    next({ status: 400, message: "failed to send message" });
  }
});
module.exports = router;
