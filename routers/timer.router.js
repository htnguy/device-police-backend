const router = require("express").Router({ mergeParams: true });
const db = require("../models/");
const twilioHelper = require("../helpers/twilio.js");
const activityAPI = require("../helpers/activityAPI.js");
var TimerBuffers = require("../timerBuffers.js");
router.route("/").post(async (req, res, next) => {
  try {
    const { hours, minutes, seconds } = req.body;
    db.Timer.deleteMany({ userId: req.params.userId }); // deleting all previous timer associated with the user
    const user = await db.User.findById(req.params.userId);
    const totalMiliSeconds = 1000 * (hours * 3600 + minutes * 60 + seconds);
    const timeout = setTimeout(() => {
      // sending a message with some recommendation when the timer is done
      activityAPI.getRandomActivity().then((ac) => {
        twilioHelper.send(
          user.phone,
          `Time to get off your device now. Try this out: ${ac}`
        );
      });
    }, totalMiliSeconds);
    TimerBuffers[req.params.userId] = timeout;
    return next("timer has been created!");
  } catch (err) {
    console.log(err);
    next({ status: 400, message: "failed to create timer" });
  }
});

router.post("/reset", async (req, res, next) => {
  try {
    clearTimeout(TimerBuffers[req.params.userId]);
    delete TimerBuffers[req.params.userId];
    next("timer stopped");
  } catch (err) {
    console.log(err);
    next({ status: 400, message: "failed to stop timer" });
  }
});
module.exports = router;
