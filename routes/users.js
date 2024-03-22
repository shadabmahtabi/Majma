const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

var userSchema = mongoose.Schema({ 
  name: String,
  email: String,
  bio: String,
  username: String,
  password: String,
  gender: String,
  isDark: {
    type: String,
    default: 0
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  profilePic: {
    type: String,
    default: "default-avatar.png"
  },
  age: {
    type: String
  },
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