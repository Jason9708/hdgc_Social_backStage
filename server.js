const express = require('express') // 引入 express
const app = express() // 实例化 express
const mongoose = require('mongoose') // 引入 mongoose
const db = require('./config/mongokey.js').mongoURI // 引入 数据库路径
const bodyParser = require('body-parser') // 引入 body-parser 作用：处理 post 请求
const passport = require('passport') // 作用：解析token

const port = process.env.PORT || 5000 // 设置端口号，本地为5000

// 测试
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/images/avatar/test.jpg");
// })

// 连接数据库
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    // success
    console.log('Mongo Connect Successful')
}).catch((e) => {
    // fail
    console.log('Mongo Connect fail')
})
mongoose.set('useFindAndModify', false) // 屏蔽useFindAndModify废弃警告

// 使用 body-parser 中间件
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// 初始化 passport
app.use(passport.initialize())
require('./config/passport')(passport)

// ---- CORS setHeader ----
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})

/**
 * 引入路由表 & 使用路由
 * @users 用户相关
 */
const users = require('./routes/Api/users')
const upload = require('./routes/Api/upload')
app.use('/hdgc/users', users)
app.use('/hdgc/upload', upload)

app.listen(port, () => {
    console.log(`❤  Server running on port ${port} ❤`)
})