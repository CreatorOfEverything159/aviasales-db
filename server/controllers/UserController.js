const {User, UserRole, Passenger, Ticket} = require('../models/models')
const jwt = require('jsonwebtoken')
const { Op } = require('@sequelize/core')
const ApiStatus = require('../status/ApiStatus')

const genToken = (login, userRole, passengerPassport = null, fio = null, tickets = []) => {
    return jwt.sign({
        login,
        userRole,
        passengerPassport,
        fio,
        tickets
    }, process.env.SECRET_KEY, {expiresIn: '6h'})
}

class UserController {

    async registration(req, res, next) {
        const {login, password, userRole, fio, passport} = req.body
        let user = await User.findOne({where: {login}})
        if (user) {
            return next() // TODO Error
        }
        let passenger = await Passenger.findOne({where: {passport}})
        if (passenger) {
            return next() // TODO Error
        }
        const role = await UserRole.findOne({where: {role: userRole}})
        await Passenger.create({passport, fio})
        await User.create({login, password, userRoleId: role.id, passengerPassport: passport})
        return res.json({message: 'Пользователь успешно создан!'})
    }

    async authorization(req, res, next) {
        const {login, password} = req.body
        const user = await User.findOne({where: {login, password}})
        if (!user) {
            return next() // TODO Error
        }
        const role = await UserRole.findOne({where: {id: user.userRoleId}})
        const passenger = await Passenger.findOne({where: {passport: user.passengerPassport}})
        const tickets = await Ticket.findAll({where: {passengerPassport: user.passengerPassport}})
        const token = genToken(user.login, role.role, passenger?.passport, passenger?.fio, tickets)
        return res.json({token})
    }

    async check(req, res, next) {
        const {user} = req
        let token
        if (req.user.userRole === 'Пассажир') {
            const tickets = await Ticket.findAll({where: {passengerPassport: user.passengerPassport}})
            token = genToken(
                req.user.login,
                req.user.userRole,
                req.user.passengerPassport,
                req.user.fio,
                tickets
            )
        } else {
            token = genToken(
                req.user.login,
                req.user.userRole
            )
        }
        return res.json({token})
    }

    async getUsers(req, res, next) {
        const {role} = req.body
        const userRole = await UserRole.findOne({where: {role}})
        if (!userRole) {
            return next() // TODO Error
        }
        const users = await User.findAll({where: {userRoleId: userRole.id}})
        return res.json(users)
    }

    async getUser(req, res, next) {
        const {login} = req.body
        const user = await User.findOne({where: {login}})
        if (!user) {
            return next() // TODO Error
        }
        return res.json(user)
    }

    async regUser(req, res, next) {
        const {login, password, userRole} = req.body
        const role = await UserRole.findOne({where: {role: userRole}})
        const user = await User.findOne({where: {login}})
        if (user) {
            return next(ApiStatus.badRequest('Такой пользователь уже существует')) // TODO Error
        }
        await User.create({login, password, userRoleId: role.id})
        return res.json({message: `Пользователь ${login} успешно создан!`})
    }

    async removeUsers(req, res, next) {
        const {login, role} = req.body
        const userRole = await UserRole.findOne({where: {role}})
        const user = await User.findOne({where: {login, userRoleId: userRole.id}})
        if (!user) {
            return next() // TODO Error
        }
        await user.destroy()
        return res.json({message: 'Пользователь удален'})
    }

    async searchUser(req, res, next) {
        const {login, role} = req.body
        const userRole = await UserRole.findOne({where: {role}})
        const users = await User.findAll({where: {login: { [Op.substring]: login}, userRoleId: userRole.id}})
        return res.json(users)
    }

}

module.exports = new UserController()
