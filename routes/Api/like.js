const express = require('express')
const router = express.Router()
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Article = require('../../models/Article') // 引入数据模型
const Like = require('../../models/Like')


/**
 * 通过文章id 对文章点赞
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('User', req.user)

    Article.findOne({
        _id: req.body.id
    }).then(article => {
        if (!article) {
            return res.json({
                code: '-1',
                message: '当前无文章'
            })
        }

        Like.findOne({
            article: req.body.id
        }).then(like => {
            // 当前还不存在该文章的like数据
            if (!like) {
                const newLike = new Like({
                    article: req.body.id,
                    articleInfo: article,
                    likes: [{
                        userId: req.user._id,
                        userName: req.user.nickname != '' ? req.user.nickname : req.user.username,
                        userAvatar: req.user.avatar,
                        userProfession: req.user.profession,
                        userCompany: req.user.company,
                    }]
                })

                newLike.save().then(like => {
                    res.json({
                        code: '0',
                        data: like,
                        message: 'like successful'
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

                like.likes.push(newLike)

                like.save().then(like => {
                    res.json({
                        code: '0',
                        data: like,
                        message: 'like successful'
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
 * 通过文章id 对文章取消点赞
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.post('/unlike', passport.authenticate('jwt', { session: false }), (req, res) => {

    Article.findOne({
        _id: req.body.id
    }).then(article => {
        if (!article) {
            return res.json({
                code: '-1',
                message: '当前无文章'
            })
        }

        Like.findOne({
            article: req.body.id
        }).then(like => {
            if (!like) {
                return res.json({
                    code: '-1',
                    message: '该文章没有获得点赞'
                })
            }

            like.likes.forEach((item, index) => {
                if (item.userId === req.user._id) {
                    like.likes.splice(index, 1)
                }
            })

            like.save().then(currentlike => {
                res.json({
                    code: '0',
                    data: currentlike,
                    message: 'like successful'
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