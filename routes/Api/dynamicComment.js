const express = require('express')
const router = express.Router()
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Dynamic = require('../../models/Dynamic') // 引入数据模型
const DynamicComment = require('../../models/DynamicComment')

/**
 * 通过动态id为文章添加主评论
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Dynamic.findOne({
        _id: req.body.id
    }).then(dynamic => {
        if (!dynamic) {
            return res.json({
                code: '-1',
                message: '无该动态'
            })
        }
        const newComment = new DynamicComment({
            dynamic: req.body.id,
            user: req.user._id,
            text: req.body.text,
            name: req.user.nickname != '' ? req.user.nickname : req.user.username,
            avatar: req.user.avatar,
        })
        newComment.save().then(comment => {

            // 发送通知
            Notice.findOne({
                user_id: dynamic.createUserId
            }).then(notice => {
                if (!notice) {
                    const newNotice = new Notice({
                        user_id: dynamic.createUserId,
                        NoticeList: [{
                            userId: req.user._id,
                            userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                            userAvatar: req.user.avatar,
                            type: '4', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                            info: dynamic,
                            content: req.body.text
                        }]
                    })

                    newNotice.save().then(new_notice => {
                        console.log('更新通知：', new_notice)
                    })
                } else {
                    notice.NoticeList.push({
                        userId: req.user._id,
                        userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                        userAvatar: req.user.avatar,
                        type: '4', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                        info: dynamic,
                        content: req.body.text
                    })

                    notice.save().then(new_notice => {
                        console.log('更新通知：', new_notice)
                    })
                }
            })

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
    DynamicComment.find({
        dynamic: req.params.id
    }).then(dynamics => {
        if (!dynamics) {
            return res.json({
                code: '0',
                data: [],
                message: '当前无该评论'
            })
        }

        res.json({
            code: '0',
            data: dynamics,
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
    DynamicComment.findById(req.params.id).then(comment => {
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
                user: req.user._id,
                text: req.body.text,
                name: req.user.nickname != '' ? req.user.nickname : req.user.username,
                avatar: req.user.avatar,
                replyer: req.body.replyerId,
                replyerName: user.nickname != '' ? user.nickname : user.username,
                replyAvatar: user.avatar
            }

            comment.comments.push(newComment) // 添加子评论

            comment.save().then(comment => {

                // 发送通知
                Notice.findOne({
                    user_id: req.body.replyerId
                }).then(notice => {
                    if (!notice) {
                        const newNotice = new Notice({
                            user_id: req.body.replyerId,
                            NoticeList: [{
                                userId: req.user._id,
                                userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                                userAvatar: req.user.avatar,
                                type: '6', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                                info: newComment,
                                content: req.body.text
                            }]
                        })

                        newNotice.save().then(new_notice => {
                            console.log('更新通知：', new_notice)
                        })
                    } else {
                        notice.NoticeList.push({
                            userId: req.user._id,
                            userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                            userAvatar: req.user.avatar,
                            type: '6', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                            info: newComment,
                            content: req.body.text
                        })

                        notice.save().then(new_notice => {
                            console.log('更新通知：', new_notice)
                        })
                    }
                })

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