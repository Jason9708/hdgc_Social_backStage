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
        type: {
            type: String,
            default: ''
        },
        articleInfo: {
            type: Object
        },
        dynamicInfo: {
            type: Object
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = Notice = mongoose.model("notices", notice_schema);