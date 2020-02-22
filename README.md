# 社交桌面应用 后端Api开发

**所选技术栈**
- node.js
- express框架
    - 涉及中间件：body-parser、bcrypt、mongoose
- 数据库 mongo


### mongo 表设计
- users 表 - 用户信息
- article 表 - 文章信息
- comment 表 - 评论信息

### 涉及技术栈
- 密码采用`bcrypt`进行加密，并通过`bcrypt.compare`对加密后的密码进行解密匹配
- 鉴权方案采用`jwt`
    - `jsonwebtoken`生成`token`
    - `passport`与`passport-jwt`解析`token`
- 图片上传（文件读写）
    - `formidable`
    - `multer`

### 项目截图