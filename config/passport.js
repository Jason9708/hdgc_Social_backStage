/**
 *  passport 配置文件
 *  @引入 passport-jwt
 *  @Strategy 策略
 *  @ExtractJwt 
 *  @options jwtFromRequest 请求携带的token， secretOrKey 生成token时的加密名字
 */

const Strategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User') // 引入数据模型 // 需要用到 mongoose 中的 model
const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = 'secretKey'

module.exports = passport => {
    /**
     * @jwt_payload 请求得到的内容
     * @done 表示策略结束,返回信息
     */
    passport.use(new Strategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id).then(user => {
            if (user) {
                return done(null, user)
            }
            return done(null, false)
        }).catch(err => {
            console.log(err)
        })
    }))
}