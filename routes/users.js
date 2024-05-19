const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required."],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  bio: {
    type: String,
    default: "Hey there! I am new to Majma😍😍",
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required."],
    trim: true,
  },
  password: {
    type: String,
    // required: true,
    trim: true,
    maxLength: [15, "Password should not exceed more than 15 characters."],
    minLength: [6, "Password should have at least 6 characters."],
    match: [
      /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,15}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
    ],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "male",
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  isDark: {
    type: String,
    default: 0,
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profilePic: {
    type: String,
    default: "default-avatar.png",
  },
  age: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    minLength: [10, "Contact should be at least 10 characters long."],
    maxLength: [10, "Contact should not exceed 10 characters."],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
