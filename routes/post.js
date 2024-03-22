const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    image: String,
    imageId: String,
    blog: String,
    desc: {
        type: String,
        // default: "Hey, I have changed my profile pic 😍😍",
        // required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

module.exports = mongoose.model("Post", postSchema);