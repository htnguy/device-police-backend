const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.ensureCorrectUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded && decoded.userId === req.params.userId) {
        return next();
      } else {
        return next({ status: 401, message: "not authorized" });
      }
    });
  } catch (err) {
    return next({ status: 401, message: "not authorized" });
  }
};
