const express = require('express')
const formidable = require('formidable')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型


/**
 * 用户头像上传
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */


router.post('/uploadHeaderPic', passport.authenticate('jwt', { session: false }), (req, res) => {
    let form = new formidable.IncomingForm() // 实例化formidable

    User.findOne({
        username: req.user.username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }

        console.log(user._id) // 当前登录人id，以id作为文件名

        form.parse(req, (error, fields, files) => {
            console.log(files)
                // 获取后缀名
            let index = files['file'].name.lastIndexOf(".");
            let suffix = files['file'].name.substr(index + 1);

            fs.writeFileSync('images/avatar/' + user._id + '.' + suffix, fs.readFileSync(files['file'].path))

            const userInfo = {
                avatar: user._id + '.' + suffix
            }

            /**
             * findOneAndUpdate
             * @匹配项
             * @需要修改的数据  $set -> 更新
             * @new 设置为rue 返回修改后的数据
             */
            User.findOneAndUpdate({ username: req.user.username }, { $set: userInfo }, { new: true }).then(user => {
                res.json({
                    code: '0',
                    data: user,
                    message: 'Update successful'
                })
            })
        })

    })
})
router.get('/images/avatar/:id', (req, res) => {
    let abcPath = path.join(__dirname, '../../')
    res.sendFile(abcPath + "/images/avatar/" + req.params.id)
})

module.exports = router