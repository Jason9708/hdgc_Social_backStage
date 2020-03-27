const express = require('express')
const router = express.Router()
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Dynamic = require('../../models/Dynamic') // 引入数据模型
const DynamicLike = require('../../models/DynamicLike')

/**
 * 通过动态id 对动态点赞
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
                message: '无当前动态'
            })
        }

        DynamicLike.findOne({
            dynamic: req.body.id
        }).then(dynamicLike => {
            // 当前还不存在该动态的like数据
            if (!dynamicLike) {
                const newLike = new DynamicLike({
                    dynamic: req.body.id,
                    dynamicInfo: dynamic,
                    likes: [{
                        userId: req.user._id,
                        userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                        userAvatar: req.user.avatar,
                        userProfession: req.user.profession,
                        userCompany: req.user.company,
                    }]
                })

                newLike.save().then(dynamicLike => {
                    Dynamic.findOneAndUpdate({ _id: req.body.id }, { like: dynamicLike.likes.length }, { new: true }).then(user => {
                        res.json({
                            code: '0',
                            data: dynamicLike,
                            message: 'like successful'
                        })
                    })
                }).catch(err => {
                    // 异常捕获
                    res.json({
                        code: '-1',
                        message: `异常捕获：${err}`
                    })
                })
            } else {
                const newLike = {
                    userId: req.user._id,
                    userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                    userAvatar: req.user.avatar,
                    userProfession: req.user.profession,
                    userCompany: req.user.company,
                }

                dynamicLike.likes.push(newLike)

                dynamicLike.save().then(dynamicLike => {
                    Dynamic.findOneAndUpdate({ _id: req.body.id }, { like: dynamicLike.likes.length }, { new: true }).then(dynamic => {

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
                                        type: '5', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                                        info: dynamic,
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
                                    type: '5', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                                    info: dynamic,
                                })

                                notice.save().then(new_notice => {
                                    console.log('更新通知：', new_notice)
                                })
                            }
                        })

                        res.json({
                            code: '0',
                            data: dynamic,
                            message: 'like successful'
                        })
                    })
                }).catch(err => {
                    // 异常捕获
                    res.json({
                        code: '-1',
                        message: `异常捕获：${err}`
                    })
                })
            }
        })
    })
})

/**
 * 通过动态id 对动态取消点赞
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/unlike', passport.authenticate('jwt', { session: false }), (req, res) => {

    Dynamic.findOne({
        _id: req.body.id
    }).then(dynamic => {
        if (!dynamic) {
            return res.json({
                code: '-1',
                message: '无当前动态'
            })
        }

        DynamicLike.findOne({
            dynamic: req.body.id
        }).then(dynamicLike => {
            if (!dynamicLike) {
                return res.json({
                    code: '-1',
                    message: '该文章没有获得点赞'
                })
            }

            dynamicLike.likes.forEach((item, index) => {
                if (JSON.stringify(item.userId) === JSON.stringify(req.user._id)) {
                    dynamicLike.likes.splice(index, 1)
                }
            })

            dynamicLike.save().then(currentlike => {
                Dynamic.findOneAndUpdate({ _id: req.body.id }, { like: currentlike.likes.length }, { new: true }).then(dynamic => {
                    res.json({
                        code: '0',
                        data: dynamic,
                        message: 'unlike successful'
                    })
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

/**
 * 获取某用户所点赞的所有动态
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/userlike/:id', (req, res) => {
    DynamicLike.find({}).then(dynamicLike => {
        if (!dynamicLike) {
            return res.json({
                code: '-1',
                message: '当前无文章'
            })
        }
        var likeArray = []
        for (let i = 0; i < dynamicLike.length; i++) {
            dynamicLike[i].likes.forEach(item => {
                if (item.userId == req.params.id) {
                    likeArray.push(dynamicLike[i])
                }
            })
        }

        res.json({
            code: '0',
            data: likeArray,
            message: 'getlikeArray successful'
        })
    })
})

module.exports = router