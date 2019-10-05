const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Create User Schema for register of users
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw Error("Email is invalid");
    }
  },

  website: {
    type: String
  },
  country: {
    type: String
  },
  languages: {
    type: [String],
    required: true
  },

  password: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    trim: true
  },

  workrole: {
    type: String
  },

  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  profilepic: {
    type: Buffer
  }
});

// Genrate Token for private routes
userSchema.methods.genrateAuthToken = async function() {
  const user = this;
  token = jwt.sign({ _id: user._id.toString() }, "queryhandlerproject", {
    expiresIn: "2 days"
  });

  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};

//find Credential details of Users
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//Hash the plain text password before saving
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("myPerson", userSchema);
module.exports = User;
