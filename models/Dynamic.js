const mongoose = require('mongoose')
const Schema = mongoose.Schema // 模型架构

/**
 * 创建 Schema
 * @createUserId 创建者Id
 * @createUserName 创建者名称
 * @createUserAvatar 创建者头像
 * @createUserCompany 创建者公司
 * @createUserProfession 创建者职业
 * @content 动态内容
 * @images 动态附图
 * @like 动态点赞数
 * @date 动态发布时间
 */
const dynamic_schema = new Schema({
    createUserId: {
        type: String,
        required: true
    },
    createUserName: {
        type: String,
        default: ''
    },
    createUserAvatar: {
        type: String,
        default: ''
    },
    createUserCompany: {
        type: String,
        default: ''
    },
    createUserProfession: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    like: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = Dynamic = mongoose.model("dynamic", dynamic_schema);