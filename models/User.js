const mongoose = require('mongoose')
const Schema = mongoose.Schema // 模型架构

/**
 * 创建 Schema
 * @username 用户名
 * @password 密码
 * @nickname 昵称
 * @avatar 头像
 * @intro 简介 
 * @profession 职业
 * @company 公司
 * @email 邮箱
 * @wechat 微信
 * @weibo 微博地址
 * @github github地址
 * @internet 个人网站
 * @date 创建时间
 */
const user_schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'default_avatar'
    },
    nickname: {
        type: String,
        default: ''
    },
    intro: {
        type: String,
        default: ''
    },
    profession: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    wechat: {
        type: String,
        default: ''
    },
    weibo: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    internet: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('users', user_schema)