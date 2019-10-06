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

// router.get("/question", async (req, res) => {
//   const page = req.query.page;
//   try {
//     const questions = await Question.find()
//       .skip((page - 1) * itemsPerPage)
//       .limit(itemsPerPage)
//       .sort({ date: "desc" });

//     const title1 = questions[0].title;
//     const category1 = questions[0].category;

//     const title2 = questions[1].title;
//     const category2 = questions[1].category;

//     const title3 = questions[2].title;
//     const category3 = questions[2].category;

//     const title4 = questions[3].title;
//     const category4 = question[3].category;

//     const title5 = questions[4].title;
//     const category5 = questions[4].category;

//     const title6 = questions[5].title;
//     const category6 = questions[5].category;
//     // res.render("question", {
//     //   title1,
//     //   category1,
//     //   title2,
//     //   category2,
//     //   title3,
//     //   category3,
//     //   title4,
//     //   category4,
//     //   title5,
//     //   category5,
//     //   title6,
//     //   category6
//     // });
//     res.render("index");
//   } catch (e) {
//     res.send("No question found" + e);
//   }
// });

router.get("/question", auth, async (req, res) => {
  const page = req.query.page;
  try {
    const questions = await Question.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ date: "desc" });

    const title1 = questions[0].title;
    const category1 = questions[0].category;

    const title2 = questions[1].title;
    const category2 = questions[1].category;

    const title3 = questions[2].title;
    const category3 = questions[2].category;

    const title4 = questions[3].title;
    const category4 = questions[3].category;

    const title5 = questions[4].title;
    const category5 = questions[4].category;

    const title6 = questions[5].title;
    const category6 = questions[5].category;
    // res.send({ questions });
    res.render("question", {
      title1,
      category1,
      title2,
      category2,
      title3,
      category3,
      title4,
      category4,
      title5,
      category5,
      title6,
      category6,
      hasQuestion: itemsPerPage > 0
    });
    // res.render("index");
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
    user: req.user._id,
    title: req.body.title,
    category: req.body.category,
    editor1: req.body.editor1
  });

  try {
    await question.save();
    res.send({ question });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
