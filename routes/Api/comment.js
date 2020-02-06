const express = require('express')
const router = express.Router()
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Article = require('../../models/Article') // 引入数据模型
const Comment = require('../../models/Comment')

/**
 * 通过文章id为文章添加主评论
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Article.find({
        _id: req.body.id
    }).then(article => {
        if (!article) {
            return res.json({
                code: '-1',
                message: '当前无文章'
            })
        }
        const newComment = new Comment({
            article: req.body.id,
            user: req.user._id,
            text: req.body.text,
            name: req.user.nickname != '' ? req.user.nickname : req.user.username,
            avatar: req.user.avatar,
        })

        newComment.save().then(comment => {
            res.json({
                code: '0',
                data: comment,
                message: 'comment successful'
            })
        }).catch(err => {
            // 异常捕获
            res.json({
                code: '-1',
                message: `异常捕获：${err}`
            })
        })
    })
})

/**
 * 通过文章id获取文章评论表
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/:id', (req, res) => {
    Comment.find({
        article: req.params.id
    }).then(comments => {
        if (!comments) {
            return res.json({
                code: '0',
                data: [],
                message: '当前无该评论'
            })
        }

        res.json({
            code: '0',
            data: comments,
            message: 'getData successful'
        })
    })
})

/**
 * 通过主评论id为文章添加子评论
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comment.findById(req.params.id).then(comment => {
        if (!comment) {
            return res.json({
                code: '-1',
                message: '当前无该评论'
            })
        }

        User.findById(req.body.replyerId).then(user => {
            if (!user) {
                return res.json({
                    code: '-1',
                    message: '所回复的用户不存在'
                })
            }

            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: req.user.nickname != '' ? req.user.nickname : req.user.username,
                avatar: req.user.avatar,
                replyer: req.body.replyerId,
                replyerName: user.nickname != '' ? user.nickname : user.username,
                replyAvatar: user.avatar
            }

            comment.comments.push(newComment) // 添加子评论

            comment.save().then(comment => {
                res.json({
                    code: '0',
                    data: comment,
                    message: 'comment successful'
                })
            }).catch(err => {
                // 异常捕获
                res.json({
                    code: '-1',
                    message: `异常捕获：${err}`
                })
            })
        })
    })
})

module.exports = router