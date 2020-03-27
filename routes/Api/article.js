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

/**
 * 用户发布文章
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @createUserId 用户Id
 * @title 文章标题
 * @classification 文章分类
 * @intro 文章简介
 * @content 文章内容
 * @mood 心情
 */
router.post('/', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {

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
            intro: req.body.intro,
            mood: req.body.mood,
        })

        // 封面图存在 存入服务器
        if (newArticle.coverPic) {
            let file = req.file;
            // 判断上传的图片格式
            // mimetype：该文件的Mime type
            if (file.mimetype == "image/jpeg") {
                newArticle.coverPic += ".jpg";
            }
            if (file.mimetype == "image/png") {
                newArticle.coverPic += ".png";
            }
            if (file.mimetype == "image/gif") {
                newArticle.coverPic += ".gif";
            }
        }

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

/**
 * 用户发布文章时图片上传
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @file
 */
router.post('/markdownPic', passport.authenticate('jwt', { session: false }), uploadMarkdownPic.single('file'), (req, res) => {
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
            var filename = "images/markdownPic/" + file.filename;
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

        if (req.file) {
            let filePath = req.file.filename;
            // 判断上传的图片格式
            // mimetype：该文件的Mime type
            if (req.file.mimetype == "image/jpeg") {
                filePath += ".jpg";
            }
            if (req.file.mimetype == "image/png") {
                filePath += ".png";
            }
            if (req.file.mimetype == "image/gif") {
                filePath += ".gif";
            }

            res.json({
                code: '0',
                data: filePath,
                message: 'markdownPicUpload successful'
            })
        }
    })
})

/**
 * 获取所有文章列表
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/', (req, res) => {
    Article.find({}).sort({ 'date': -1 }).then((articles) => {
        if (!articles) {
            return res.json({
                code: '0',
                data: [],
                message: '当前无文章'
            })
        } else {
            return res.json({
                code: '0',
                data: articles,
                message: 'getData successful'
            })
        }

    })
})

/**
 * 获取所有文章列表
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 */
router.get('/getHotArticle', (req, res) => {
    Article.find({}).sort({ 'like': -1 }).then((articles) => {
        if (!articles) {
            return res.json({
                code: '0',
                data: [],
                message: '当前无文章'
            })
        } else {

            let topFiveArticle = []
            topFiveArticle = articles.slice(0, 5)
            return res.json({
                code: '0',
                data: topFiveArticle,
                message: 'getData successful'
            })
        }

    })
})


/**
 * 根据用户id获取文章列表
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @id 用户id
 */
router.get('/:id', (req, res) => {
    User.findOne({
        _id: req.params.id
    }).sort({ 'date': -1 }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }

        Article.find({
            createUserId: req.params.id
        }).then((articles) => {
            if (!articles) {
                return res.json({
                    code: '0',
                    data: [],
                    message: '当前无文章'
                })
            } else {
                return res.json({
                    code: '0',
                    data: articles,
                    message: 'getData successful'
                })
            }

        })
    })
})

/**
 * 根据 用户id + 文章type 获取文章列表
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @id 用户id
 */
router.get('/getArticleListByIdAndType/:id/:type', (req, res) => {
    User.findOne({
        _id: req.params.id
    }).sort({ 'date': -1 }).then((user) => {
        if (!user) {
            return res.json({
                code: '-1',
                message: '用户信息不存在'
            })
        }
        if (req.params.type == 0) {
            Article.find({
                createUserId: req.params.id
            }).then((articles) => {
                if (!articles) {
                    return res.json({
                        code: '0',
                        data: [],
                        message: '当前无文章'
                    })
                } else {
                    return res.json({
                        code: '0',
                        data: articles,
                        message: 'getData successful'
                    })
                }
            })
        } else {
            Article.find({
                createUserId: req.params.id,
                classification: req.params.type
            }).then((articles) => {
                if (!articles) {
                    return res.json({
                        code: '0',
                        data: [],
                        message: '当前无文章'
                    })
                } else {
                    return res.json({
                        code: '0',
                        data: articles,
                        message: 'getData successful'
                    })
                }
            })
        }
    })
})

/**
 * 根据id获取文章详情
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @id 文章id
 */
router.get('/articleInfo/:id', (req, res) => {
    Article.findOne({
        _id: req.params.id
    }).then((article) => {
        if (!article) {
            return res.json({
                code: '-1',
                message: '当前无文章'
            })
        } else {
            return res.json({
                code: '0',
                data: article,
                message: 'getData successful'
            })
        }

    })
})

/**
 * 根据id删除文章
 * @json
 *  - code: 信息码
 *  - data：数据
 *  - messgae：提示信息
 * 
 * 接受的必要参数
 * @id 文章id
 */
router.delete('/:id', (req, res) => {
    Article.findOneAndRemove({
        _id: req.params.id
    }, function(err, article) {
        if (err) {
            return res.json({
                code: '-1',
                message: err
            })
        } else {
            return res.json({
                code: '0',
                message: 'deleteData successful'
            })
        }
    })
})

/**
 *  获取封面图图片
 */
router.get('/images/articleCover/:id', (req, res) => {
    let abcPath = path.join(__dirname, '../../')
    res.sendFile(abcPath + "/images/articleCover/" + req.params.id)
})

/**
 *  获取文章图片
 */
router.get('/images/markdownPic/:id', (req, res) => {
    let abcPath = path.join(__dirname, '../../')
    res.sendFile(abcPath + "/images/markdownPic/" + req.params.id)
})



module.exports = router