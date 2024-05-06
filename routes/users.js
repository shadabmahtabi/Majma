const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

var userSchema = mongoose.Schema({ 
  name: String,
  email: String,
  bio: String,
  username: String,
  password: {
    type: String,
    select: false
  },
  gender: String,
  isDark: {
    type: String,
    default: 0
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  profilePic: {
    type: String,
    default: "default-avatar.png"
  },
  age: {
    type: String
  },
  mobileNumber: Number,
  cardNumber: {
    type: String,
    default: "XXXX XXXX XXXX"
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }]
})

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);