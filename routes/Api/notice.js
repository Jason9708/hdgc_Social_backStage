const express = require('express')
const router = express.Router()
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Notice = require('../../models/Notice') // 引入数据模型


/**
 * 通过用户id 获取用户消息表
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOne({
        username: req.user.username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }

        Notice.findOne({
            user_id: req.user._id
        }).then(notice => {
            if (!notice) {
                return res.json({
                    code: '0',
                    data: {
                        user_id: req.user._id,
                        noticeList: []
                    },
                    message: 'getNotice successful'
                })
            }

            res.json({
                code: '0',
                data: notice,
                message: 'getNotice successful'
            })

            // Notice.findAndUpdate({ user_id: req.user._id }, { noticeList: [] }, { new: true }).then(notice => {
            //     // do nothing...
            // })
        })
    })
})

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOne({
        username: req.user.username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }

        Notice.findOne({
            user_id: req.user._id
        }).then(notice => {
            if (!notice) {
                return res.json({
                    code: '-1',
                    message: '该通知不存在'
                })
            }

            var noticeList = notice.NoticeList
            for (let i = 0; i < noticeList.length; i++) {
                if (noticeList[i]._id == req.body.id) {
                    noticeList.splice(i, 1)
                }
            }


            Notice.findOneAndUpdate({ user_id: req.user._id }, { NoticeList: noticeList }, { new: true }).then(notice => {
                res.json({
                    code: '0',
                    data: notice,
                    message: 'getNotice successful'
                })
            })
        })
    })
})

module.exports = router