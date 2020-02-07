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
                    Article.findOneAndUpdate({ _id: req.body.id }, { like: like.likes.length }, { new: true }).then(user => {
                        res.json({
                            code: '0',
                            data: like,
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

                like.likes.push(newLike)

                like.save().then(like => {
                    Article.findOneAndUpdate({ _id: req.body.id }, { like: like.likes.length }, { new: true }).then(user => {
                        res.json({
                            code: '0',
                            data: like,
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
                if (JSON.stringify(item.userId) === JSON.stringify(req.user._id)) {
                    like.likes.splice(index, 1)
                }
            })

            like.save().then(currentlike => {
                Article.findOneAndUpdate({ _id: req.body.id }, { like: currentlike.likes.length }, { new: true }).then(user => {
                    res.json({
                        code: '0',
                        data: currentlike,
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
 * 获取某用户所点赞的所有文章
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/userlike/:id', (req, res) => {
    Like.find({}).then(like => {
        if (!like) {
            return res.json({
                code: '-1',
                message: '当前无文章'
            })
        }
        var likeArray = []
        for (let i = 0; i < like.length; i++) {
            like[i].likes.forEach(item => {
                if (item.userId == req.params.id) {
                    likeArray.push(like[i])
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