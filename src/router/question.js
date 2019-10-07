const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/jwt");

//Load User Model
const User = require("../models/User");

//Load Question Model
const Question = require("../models/Question");

//@type     GET
//@route    /api/questions
//@desc     /route for showing all Questions
//@access   /PUBLIC

let itemsPerPage = 6;

router.get("/question", auth, async (req, res) => {
  const page = req.query.page;
  try {
    const questions = await Question.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ date: "desc" });
    let name = [];
    let title = [];
    let category = [];

    for (i of questions) {
      name.push(i.name);
      title.push(i.title);
      category.push(i.category);
    }

    res.render("question", {
      name,
      title,
      category,
      hasQuestion: questions.length > 0
    });
  } catch (e) {
    res.send("No question found" + e);
  }
});

//@type     GET
//@route    /askQuestion
//@desc     /route for submitting questions
//@access   /PRIVATE

router.post("/question", auth, async (req, res) => {
  const question = new Question({
    name: req.user.name,
    user: req.user._id,
    title: req.body.title,
    category: req.body.category,
    editor1: req.body.editor1
  });

  try {
    await question.save();
    res.redirect("/question");
  } catch (e) {
    res.send(e);
  }
});

//@type     GET
//@route    /myQuestions
//@desc     /route for indivisual users Questions
//@access   /PRIVATE

router.get("/myquestions", auth, async (req, res) => {
  user_id = req.user._id;
  page = req.query.page;

  try {
    const userQuestions = await Question.find({ user: user_id })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ date: "desc" });
    let title = [];
    let category = [];

    for (i of userQuestions) {
      title.push(i.title);
      category.push(i.category);
    }

    res.render("myquestion", {
      title,
      category,
      hasQuestion: userQuestions.length > 0
    });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
