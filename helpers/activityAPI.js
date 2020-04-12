const axios = require("axios");

const API_URL = "http://www.boredapi.com/api";
exports.getRandomActivity = async (req, res, next) => {
  try {
    const { data: activity } = await axios.get(`${API_URL}/activity/`);
    return activity.activity;
  } catch (er) {
    next({ status: 400, message: "failed to get activity" });
  }
};
