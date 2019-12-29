const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs') // 加密插件
const jsonwebtoken = require('jsonwebtoken') // 生成 token
const passport = require('passport') // 解析token
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
    console.log(req.body)
        // 1- 判断数据库是否已存在该用户名
    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (user) {
            return res.json({
                code: '-1',
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
router.post('/login', (req, res) => {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password
        // 查询当前用户是否存在
    User.findOne({
        username: username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '当前用户未注册'
            })
        }
        // 使用bcrypt对加密密码进行解密匹配
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // 匹配成功
                const rule = {
                        id: user.id,
                        username: user.username
                    }
                    /**
                     * jsonwebtoken 参数意义
                     * @规则
                     * @加密名字
                     * @过期时间
                     * @箭头函数
                     * @返回token
                     */
                jsonwebtoken.sign(rule, 'secretKey', { expiresIn: 3600 }, (err, token) => {
                    if (err) {
                        // token生成异常捕获
                        res.json({
                            code: '-1',
                            message: `token生成异常捕获：${err}`
                        })
                        return
                    }
                    res.json({
                        code: '0',
                        data: user,
                        token: 'Bearer ' + token, // 必须在前面加上 'Bearer '
                        message: 'Login successful'
                    })
                })
            } else {
                // 匹配失败
                return res.json({
                    code: '-1',
                    message: '用户名或密码错误'
                })
            }
        })
    })
})


/**
 * 使用 Restful 风格 获取和修改当前用户信息
 * @get 获取用户信息
 * @post 修改用户信息
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * @回调将在认证通过后才执行
 * @前端只有进行登陆后得到token才能访问该接口
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
        req.user.password = '******' // user 为 passport 执行 done() 所传入的信息，注意password不能明文出现
        res.json({
            code: '0',
            data: req.user,
            message: 'success'
        })
    })
})
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userInfo = {}
        // 判断请求回来的数据，进行对应赋值
    if (req.body.nickname) userInfo.nickname = req.body.nickname // 用户昵称
    if (req.body.intro) userInfo.intro = req.body.intro // 简介
    if (req.body.profession) userInfo.profession = req.body.profession // 职业
    if (req.body.company) userInfo.company = req.body.company // 公司
    if (req.body.email) userInfo.email = req.body.email // 邮箱
    if (req.body.wechat) userInfo.wechat = req.body.wechat // 微信
    if (req.body.weibo) userInfo.weibo = req.body.weibo // 微博
    if (req.body.github) userInfo.github = req.body.github // githu
    if (req.body.internet) userInfo.internet = req.body.internet // 个人网站

    User.findOne({
        username: req.user.username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
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
module.exports = router