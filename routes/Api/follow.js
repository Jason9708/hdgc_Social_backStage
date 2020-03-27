const express = require('express')
const router = express.Router()
const User = require('../../models/User') // 引入数据模型
const Article = require('../../models/Article') // 引入数据模型
const Follow = require('../../models/Follow')

/**
 * 通过用户id获取用户关注信息
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/:id', (req, res) => {
    Follow.findOne({
        _id: req.params.id
    }).then((follow) => {
        if (!follow) {
            return res.json({
                code: '-1',
                message: '当前无关注信息'
            })
        } else {
            return res.json({
                code: '0',
                data: follow,
                message: 'getData successful'
            })
        }

    })
})

/**
 * 通过id 关注某人、
 * @noticerId 关注人的Id
 * @followId 被关注人的Id
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/follow', (req, res) => {
    // 被关注人逻辑（ 被关注人的被关注数据修改）
    new Promise((resolve, reject) => {
        User.findOne({
            _id: req.body.noticerId
        }).then((user) => {
            if (!user) {
                reject('当前用户不存在')
            } else {
                Follow.findOne({
                    _id: req.body.followId
                }).then((followObj) => {
                    if (!followObj) {
                        reject('当前无关注信息')
                    } else {
                        if (user.password) {
                            delete user.password
                        }

                        const noticer = followObj.noticer

                        noticer.push(user)
                        Follow.findOneAndUpdate({ _id: req.body.followId }, { noticer: noticer }, { new: true }).then(newFollow => {

                            // 发送通知
                            Notice.findOne({
                                user_id: req.body.followId
                            }).then(notice => {
                                if (!notice) {
                                    const newNotice = new Notice({
                                        user_id: req.body.followId,
                                        NoticeList: [{
                                            userId: user._id,
                                            userName: user.nickname != '' ? user.nickname : user.username,
                                            userAvatar: user.avatar,
                                            type: '7', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                                        }]
                                    })

                                    newNotice.save().then(new_notice => {
                                        console.log('更新通知：', new_notice)
                                    })
                                } else {
                                    notice.NoticeList.push({
                                        userId: user._id,
                                        userName: user.nickname != '' ? user.nickname : user.username,
                                        userAvatar: user.avatar,
                                        type: '7', // 1 - 文章评论， 2 - 文章点赞，3 - 文章子评论， 4 - 动态评论， 5 - 动态点赞， 6 - 动态子评论， 7 - 关注
                                    })

                                    notice.save().then(new_notice => {
                                        console.log('更新通知：', new_notice)
                                    })
                                }
                            })

                            resolve()
                        })
                    }
                })
            }
        })
    }).then(() => {
        User.findOne({
            _id: req.body.followId
        }).then((user) => {
            if (!user) {
                reject('当前用户不存在')
            } else {
                Follow.findOne({
                    _id: req.body.noticerId
                }).then((followObj) => {
                    if (!followObj) {
                        reject('当前无关注信息')
                    } else {
                        if (user.password) {
                            delete user.password
                        }
                        const follow = followObj.follow

                        follow.push(user)

                        Follow.findOneAndUpdate({ _id: req.body.noticerId }, { follow: follow }, { new: true }).then(newFollow => {
                            return res.json({
                                code: '0',
                                data: newFollow,
                                message: 'update successful'
                            })
                        })
                    }
                })
            }
        })
    }).catch(err => {
        return res.json({
            code: '-1',
            message: err
        })
    })
})

/**
 * 通过id 取消关注某人、
 * @id 当前操作人id
 * @unfollowId 被取消关注人的Id
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/unfollow', (req, res) => {
    new Promise((resolve, reject) => {
        Follow.findOne({
            _id: req.body.unfollowId
        }).then((followObj) => {
            if (!followObj) {
                reject('当前无关注信息')
            } else {
                const noticer = followObj.noticer

                noticer.forEach((item, index) => {
                    if (item._id == req.body.id) {
                        noticer.splice(index, 1)
                    }
                })

                Follow.findOneAndUpdate({ _id: req.body.unfollowId }, { noticer: noticer }, { new: true }).then(newFollow => {
                    resolve()
                })
            }
        })
    }).then(() => {
        Follow.findOne({
            _id: req.body.id
        }).then((followObj) => {
            if (!followObj) {
                reject('当前无关注信息')
            } else {
                const follow = followObj.follow

                follow.forEach((item, index) => {
                    if (item._id == req.body.unfollowId) {
                        follow.splice(index, 1)
                    }
                })

                Follow.findOneAndUpdate({ _id: req.body.id }, { follow: follow }, { new: true }).then(newFollow => {
                    return res.json({
                        code: '0',
                        data: newFollow,
                        message: 'update successful'
                    })
                })
            }
        })
    }).catch(err => {
        return res.json({
            code: '-1',
            message: err
        })
    })
})

/**
 * 通过id获取某人关注列表
 * @id
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/follow/:id', (req, res) => {
    Follow.findOne({
        _id: req.params.id
    }).then((followObj) => {
        if (!followObj) {
            return res.json({
                code: '0',
                data: [],
                message: 'getData successful'
            })
        } else {
            return res.json({
                code: '0',
                data: followObj.follow,
                message: 'getData successful'
            })
        }
    })
})

/**
 * 通过id获取某人被关注列表
 * @id
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/noticer/:id', (req, res) => {
    Follow.findOne({
        _id: req.params.id
    }).then((followObj) => {
        if (!followObj) {
            return res.json({
                code: '0',
                data: [],
                message: 'getData successful'
            })
        } else {
            return res.json({
                code: '0',
                data: followObj.noticer,
                message: 'getData successful'
            })
        }
    })
})


module.exports = router