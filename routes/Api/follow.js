const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: 'images/articleCover' }) //设置上传的目录文件夹
const uploadMarkdownPic = multer({ dest: 'images/markdownPic' })
const passport = require('passport') // 解析token
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
router.post('/', (req, res) => {
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
                            resolve()
                        })
                    }
                })
            }
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
        })
    })
})

module.exports = router