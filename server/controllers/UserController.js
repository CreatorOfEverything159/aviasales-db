const {User} = require('../models/models')
const jwt = require("jsonwebtoken");

const genToken = (login, userRoleId) => {
    return jwt.sign({login, userRoleId}, process.env.SECRET_KEY, {expiresIn: '6h'})
}

class UserController {

    async registration(req, res, next) {
        const {login, password, userRoleId} = req.body
        let user = await User.findOne({where: {login}})
        if (user) {
            return next() // TODO Error
        }
        user = await User.create({login, password, userRoleId})
        return res.json(user)
    }

    async login(req, res, next) {
        const {login, password} = req.body
        const user = await User.findOne({where: {login, password}})
        if (!user) {
            return next() // TODO Error
        }
        const token = genToken(user.login, user.userRoleId)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = genToken(req.user.login, req.user.userRoleId)
        return res.json({token})
    }

}

module.exports = new UserController()
