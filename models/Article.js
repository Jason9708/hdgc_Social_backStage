const mongoose = require('mongoose')
const Schema = mongoose.Schema // 模型架构

/**
 * 创建 Schema
 * @createUserId 创建者Id
 * @createUserInfo 创建者信息
 * @coverPic 封面图片
 * @title 头像
 * @classification 分类 
 * @content 文章内容
 * @mood 心情
 * @date 创建时间 / 更新时间
 */
const article_schema = new Schema({
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
    coverPic: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true,
    },
    classification: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    intro: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
        required: true,
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

module.exports = Article = mongoose.model('articles', article_schema)