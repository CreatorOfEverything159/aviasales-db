const {User, UserRole, Passenger, Ticket} = require('../models/models')
const jwt = require('jsonwebtoken')

const genToken = (login, userRole, passengerPassport, fio, tickets) => {
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
        return res.json({message: 'nice!'})
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
        const tickets = await Ticket.findAll({where: {passengerPassport: user.passengerPassport}})
        // const token = genToken(user.login, role.role, passenger?.passport, passenger?.fio, tickets)
        const token = genToken(
            req.user.login,
            req.user.userRole,
            req.user.passengerPassport,
            req.user.fio,
            tickets
        )
        return res.json({token})
    }

}

module.exports = new UserController()
