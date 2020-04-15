const router = require("express").Router();
const { ensureCorrectUser } = require("../middleware/auth.middleware");
const db = require("../models/");

router.delete("/:userId/delete", ensureCorrectUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const existingUser = await db.User.findById(userId);
    if (existingUser) {
      const isMatch = await existingUser.comparePassword(req.query.password);
      if (isMatch) {
        existingUser.remove();
        return next("user has been deleted!");
      }
      return next({ status: 401, message: "password does not match!" });
    } else {
      next({ status: 400, message: "sorry user does not exists" });
    }
  } catch (err) {
    console.log(err);
    next({
      status: 400,
      message: "failed to remove the user please try again later",
    });
  }
});

module.exports = router;
