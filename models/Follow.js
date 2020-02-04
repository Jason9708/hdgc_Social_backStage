const mongoose = require('mongoose')
const Schema = mongoose.Schema // 模型架构

/**
 * 创建 Schema
 */
const follow_schema = new Schema({
    _id: {
        type: String,
        required: true
    },
    follow: {
        type: Array,
        default: []
    },
    noticer: {
        type: Array,
        default: []
    }
})

follow_schema.set('_id', false);

module.exports = Follow = mongoose.model('follows', follow_schema)