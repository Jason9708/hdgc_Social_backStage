const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const notice_schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    NoticeList: [{
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
        type: { // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 6 - 关注
            type: String,
            default: ''
        },
        info: {
            type: Object
        },
        content: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = Notice = mongoose.model("notices", notice_schema);