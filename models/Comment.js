const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const comment_schema = new Schema({
    //关联users
    article: {
        type: Schema.Types.ObjectId,
        ref: "articles"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
        replyer: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        replyerName: {
            type: String,
            default: ''
        },
        replyAvatar: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Comment = mongoose.model("comments", comment_schema);