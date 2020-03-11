const express = require('express')
const router = express.Router()
const User = require('../../models/User') // 引入数据模型
const Article = require('../../models/Article') // 引入数据模型

/**
 *  搜索
 * @json
 *  - code: 信息码
 *  - data：
 *       - users 用户
 *       - articles
 *  - messgae：提示信息
 */
router.post('/', (req, res) => {
    var userReg = new RegExp(req.body.searchText, 'i'); //模糊查询参数

    User.find({
        $or: [ //多条件，数组
            { nickname: { $regex: userReg } },
        ]
    }).then(users => {
        var articleReg = new RegExp(req.body.searchText, 'i')
        Article.find({
            $or: [ //多条件，数组
                { title: { $regex: articleReg } },
            ]
        }).then(articles => {
            res.json({
                code: '0',
                data: {
                    users: users,
                    articles: articles
                },
                message: 'search successful'
            })
        })
    })
})

module.exports = router