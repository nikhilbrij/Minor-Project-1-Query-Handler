const express = require("express");
const User = require("../models/User");
const router = new express.Router();
const auth = require("../middleware/jwt");

// @type    GET
// @route   /
// @desc    route for home page
// @access  PUBLIC
router.get("/", (req, res) => {
  res.render("index");
});

// @type    POST
// @route   /signup
// @desc    route for register of users
// @access  PUBLIC

router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.genrateAuthToken(); //push Token in the deatabase
    res.status(201).send({ user, token });
  } catch (e) {
    res.send(e);
  }
});

// @type    POST
// @route   /login
// @desc    route for login of users
// @access  PRIVATE

router.post("/", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.genrateAuthToken();
    res.cookie("token", token); //Send token in the Cookies
    res.redirect("/profile");
  } catch (e) {
    res.status(400).render("index", {
      errorMsg: "unable to login"
    });
  }
});

// @type    GET
// @route   /profile
// @desc    route for get profile
// @access  PRIVATE

router.get("/profile", auth, async (req, res) => {
  try {
    const _id = req.user._id;
    const user = await User.findOne({ _id });

    const username = user.username;
    const name = user.name;
    const email = user.email;
    const website = user.website;
    const country = user.country;
    const languages = user.languages;
    const age = user.age;
    const workrole = user.workrole;

    res.render("profile", {
      username,
      name,
      email,
      website,
      country,
      languages,
      age,
      workrole
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

// @type    POST
// @route   /profile
// @desc    route for Upadte Profile
// @access  PRIVATE

router.post("/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "name",
    "email",
    "website",
    "country",
    "languages",
    "age",
    "workrole"
  ];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid Opertaion!");
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.redirect("/profile");
  } catch (e) {
    res.status(500).send("unable to update " + e);
  }
});

// @type    POST
// @route   /logout
// @desc    route for Logut
// @access  PRIVATE

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.redirect("/");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
