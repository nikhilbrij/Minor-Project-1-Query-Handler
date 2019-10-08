const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "myUser"
  },
  name: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },

  problem: {
    type: String,
    required: true
  },

  editor1: {
    type: String,
    required: true
  },

  upvotes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "myUser"
      }
    }
  ],
  answers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "myUser"
      },
      youranswer: {
        type: String,
        required: true
      },
      editor1: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

Question = mongoose.model("myQuestion", QuestionSchema);
module.exports = Question;
