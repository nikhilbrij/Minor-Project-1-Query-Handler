const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    token = req.get("Cookie").split("=")[1]; // Get Cookie from the browser
    const decode = jwt.verify(token, "queryhandlerproject");
    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
