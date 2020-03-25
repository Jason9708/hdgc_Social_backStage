const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const dynamicLike_schema = new Schema({
    //关联users
    dynamic: {
        type: Schema.Types.ObjectId,
        ref: "dynamics"
    },
    dynamicInfo: {
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

module.exports = DynamicLike = mongoose.model("dynamicLikes", dynamicLike_schema);