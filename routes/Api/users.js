const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs') // 加密插件
const User = require('../../models/User') // 引入数据模型

/**
 * @test 测试用例
 */
router.get("/test", (req, res) => {
    res.json({
        message: 'Test route'
    })
})


/**
 * 用户相关登录、注册接口
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * @表单验证由前端处理
 */
router.post('/register', (req, res) => {
    // 1- 判断数据库是否已存在该用户名
    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (user) {
            return res.status(400).json({
                code: '0',
                email: '用户名已存在'
            })
        } else {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password
            })

            // password加密处理
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    // hash - 加密后的密码
                    if (err) {
                        // 加密异常捕获
                        res.json({
                            code: '-1',
                            message: `密码加密异常捕获：${err}`
                        })
                        return
                    }
                    newUser.password = hash

                    // 存入数据库
                    newUser.save().then(user => {
                        res.json({
                            code: '0',
                            data: user,
                            message: 'register successful'
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
        }
    })
})

module.exports = router