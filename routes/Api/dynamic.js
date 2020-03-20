const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: 'images/dynamicPic' }); //设置上传的目录文件夹
const passport = require('passport') // 解析token
const User = require('../../models/User') // 引入数据模型
const Dynamic = require('../../models/Dynamic') // 引入数据模型

/**
 * 用户发布动态
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @createUserId 用户Id
 * @content 动态内容
 * @imgList 动态附图
 */
router.post('/', passport.authenticate('jwt', { session: false }), upload.array('files'), (req, res) => {
    User.findOne({
        username: req.user.username
    }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }

        console.log(req)
            // 封面图存在 存入服务器
        if (req.files) {
            let files = req.files
            for (let i = 0; i < files.length; i++) {
                // fieldname: 上传文件标签在表单中的name
                let filename = "images/dynamicPic/" + files[i].filename;
                // 判断上传的图片格式
                // mimetype：该文件的Mime type
                if (files[i].mimetype == "image/jpeg") {
                    filename += ".jpg";
                }
                if (files[i].mimetype == "image/png") {
                    filename += ".png";
                }
                if (files[i].mimetype == "image/gif") {
                    filename += ".gif";
                }
                fs.renameSync(files[i].path, filename);
            }
        }

        // 获取数据 存入数据库
        const newDynamic = new Dynamic({
            createUserId: user._id,
            createUserName: user.nickname,
            createUserAvatar: user.avatar,
            createUserCompany: user.company,
            createUserProfession: user.profession,
            images: [],
            content: req.body.content,
        })

        // 封面图存在 存入服务器
        if (req.files) {
            let files = req.files
            for (let i = 0; i < req.files.length; i++) {
                // 判断上传的图片格式   mimetype：该文件的Mime type
                if (files[i].mimetype == "image/jpeg") {
                    newDynamic.images.push(files[i].filename += ".jpg")
                }
                if (files[i].mimetype == "image/png") {
                    newDynamic.images.push(files[i].filename += ".png")
                }
                if (files[i].mimetype == "image/gif") {
                    newDynamic.images.push(files[i].filename += ".gif")
                }
            }
        }

        // 存入数据库
        newDynamic.save().then(dynamic => {
            res.json({
                code: '0',
                data: dynamic,
                message: 'sumbit successful'
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

/**
 * 获取所有动态（按时间排序）
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/', (req, res) => {
    Dynamic.find({}).sort({ 'date': -1 }).then((dynamics) => {
        if (!dynamics) {
            return res.json({
                code: '0',
                data: [],
                message: '当前无动态'
            })
        } else {
            return res.json({
                code: '0',
                data: dynamics,
                message: 'getData successful'
            })
        }

    })
})

/**
 *  获取动态附图
 */
router.get('/images/dynamicPic/:id', (req, res) => {
    let abcPath = path.join(__dirname, '../../')
    res.sendFile(abcPath + "/images/dynamicPic/" + req.params.id)
})



module.exports = router