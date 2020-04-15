const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const helmet = require("helmet");
const PORT = process.env.PORT || 3000;
const AuthRouter = require("./routers/auth.router");
const SMSRouter = require("./routers/sms.router");
const TimerRouter = require("./routers/timer.router.js");
const UserRouter = require("./routers/user.router.js");
const { ensureCorrectUser } = require("./middleware/auth.middleware.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());

// SETTING UP CORS
if (process.env.NODE_ENV !== "production") {
  app.use(cors()); // enabling all cors for development
} else {
  // only allowing the client frontend to send request
  const whitelist = [process.env.CLIENT_URL];

  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  app.use(cors(corsOptions));
}
// INITIALIZING ROTUES
app.use("/auth", AuthRouter);
app.use("/twilio", SMSRouter);
app.use("/timer/:userId", ensureCorrectUser, TimerRouter);
app.use("/user", UserRouter);

//  RESPONSE AND ERROR HANDLER
app.use((payload, req, res, next) => {
  // if there was an error
  if (payload.status >= 400) {
    return res.status(payload.status || 400).json({
      ...payload,
      message:
        payload.message || "failed to complete request, please try again later",
    });
  }
  // everything was fine and returning a success response with the payload
  return res.status(payload.status || 200).json(payload);
});

// LISTENING ON PORT
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
