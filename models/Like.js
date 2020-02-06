const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const like_schema = new Schema({
    //关联users
    article: {
        type: Schema.Types.ObjectId,
        ref: "articles"
    },
    articleInfo: {
        type: Object,
        default: {}
    },
    likes: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        userName: {
            type: String,
            default: ''
        },
        userAvatar: {
            type: String,
            default: ''
        },
        userProfession: {
            type: String,
            default: ''
        },
        userCompany: {
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

module.exports = Like = mongoose.model("likes", like_schema);