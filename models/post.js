const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    likeByUser: {
        type: Boolean,
        default: false,
    },
    likes: [
        { type: ObjectId, ref: "User" },
    ],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
    }],
    postedBy: {
        type: ObjectId,
        ref: "User",
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;