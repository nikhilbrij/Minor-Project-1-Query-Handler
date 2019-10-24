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
//@access   /PRIVATE

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
    let questions_Id = [];

    for (i of questions) {
      name.push(i.name);
      title.push(i.title);
      category.push(i.category);
      questions_Id.push(i._id);
    }

    res.render("question", {
      name,
      title,
      category,
      questions_Id,
      hasQuestion: questions.length > 0
    });
  } catch (e) {
    res.send("No question found" + e);
  }
});

//@type     GET
//@route    /question
//@desc     /route for submitting questions
//@access   /PRIVATE

router.post("/question", auth, async (req, res) => {
  const question = new Question({
    name: req.user.name,
    user: req.user._id,
    title: req.body.title,
    category: req.body.category,
    problem: req.body.problemStatement,
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
//@route    /myquestions
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
    let questions_Id = [];

    for (i of userQuestions) {
      title.push(i.title);
      category.push(i.category);
      questions_Id.push(i._id);
    }

    res.render("myquestion", {
      questions_Id,
      user_id,
      title,
      category,
      hasQuestion: userQuestions.length > 0
    });
  } catch (e) {
    res.send(e);
  }
});

//@type     GET
//@route    /question/:id/details
//@desc     /route for get the answers
//@access   /PRIVATE

router.get("/question/:id/:details", auth, async (req, res) => {
  const questionTitle = req.params.details.replace(/%20/g, " ");
  const question_Id = req.params.id;
  let totalAnswers = [];
  let totalUserNameForAnswers = [];
  let totalCode = [];

  try {
    const question = await Question.findOne({
      _id: question_Id,
      title: questionTitle
    });

    for (i of question.answers) {
      totalAnswers.push(i.youranswer);
      totalUserNameForAnswers.push(i.name);
      totalCode.push(i.editor1);
    }

    const questionId = question._id;

    res.render("answer", {
      title: questionTitle,
      problem: question.problem,
      code: question.editor1,
      questionId,
      totalAnswers,
      totalUserNameForAnswers,
      totalCode
    });
  } catch (e) {
    res.send(e);
  }
});

//@type     GET
//@route    /question/answer/:id
//@desc     /route for submitting answer
//@access   /PRIVATE

router.post("/question/answer/:id", auth, async (req, res) => {
  const questions_Id = req.params.id;
  try {
    const question = await Question.findById({ _id: questions_Id });
    const newAnswer = {
      user: req.user._id,
      name: req.user.name,
      youranswer: req.body.yourAnswer,
      editor1: req.body.editor1
    };
    const questionTitle = question.title;

    question.answers.unshift(newAnswer);
    await question.save();

    res.redirect(`/question/${question._id}/${questionTitle}`);
  } catch (e) {
    res.send(e);
  }
});

// @type    POST
//@route    /questions/upvote/:id
// @desc    route for for upvoting
// @access  PRIVATE
router.post("/questions/upvote/:id", auth, async (req, res) => {
  try {
    const userProfile = await User.findOne({ user: req.user._id });

    const question = await Question.findById(req.params.id);
    if (
      question.upvotes.filter(
        upvote => upvote.user.toString() === req.user._id.toString()
      ).length > 0
    ) {
      // var index = question.upvotes.indexOf(req.user._id);
      // console.log(index);
      // question.upvotes.splice(index, 1);
      console.log(question);
      question.upvotes.pop({ user: req.user });
      console.log(req.user._id)

      question.save();
      // res.send(question);
    }

    question.upvotes.unshift({ user: req.user._id });
    await question.save();
    res.send(question);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
