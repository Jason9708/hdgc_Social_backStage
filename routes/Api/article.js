const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: 'images/articleCover' }) //设置上传的目录文件夹
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Article = require('../../models/Article') // 引入数据模型

/**
 * 用户发布文章
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @createUserId 用户Id
 * @createUserInfo 用户信息
 * @content 文章内容
 */
router.post('/', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
    console.log(req.file)
    console.log(req.body)

    User.findOne({
        username: req.user.username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }

        // 封面图存在 存入服务器
        if (req.file) {
            let file = req.file;
            // fieldname: 上传文件标签在表单中的name
            let filename = "images/articleCover/" + file.filename;
            // 判断上传的图片格式
            // mimetype：该文件的Mime type
            if (file.mimetype == "image/jpeg") {
                filename += ".jpg";
            }
            if (file.mimetype == "image/png") {
                filename += ".png";
            }
            if (file.mimetype == "image/gif") {
                filename += ".gif";
            }
            fs.renameSync(file.path, filename);
        }

        // 获取数据 存入数据库
        const newArticle = new Article({
            createUserId: user._id,
            createUserName: user.nickname,
            createUserAvatar: user.avatar,
            createUserCompany: user.company,
            createUserProfession: user.profession,
            coverPic: req.file ? req.file.filename : '',
            title: req.body.title,
            content: req.body.content,
            classification: req.body.classification,
            mood: req.body.mood,
        })

        // 存入数据库
        newArticle.save().then(article => {
            res.json({
                code: '0',
                data: article,
                message: 'release successful'
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


module.exports = router