require("dotenv").config();
const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TKOKEN;
const client = require("twilio")(accountSid, authToken);

async function send(to, body) {
  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE,
    to,
  });
  return message;
}

module.exports = { send };
