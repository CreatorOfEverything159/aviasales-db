const {Ticket, Passenger} = require('../models/models')
const {Op} = require('@sequelize/core')
const ApiStatus = require('../status/ApiStatus')

class PassengerController {

    async passengersByFlight(req, res, next) {
        const {flightId} = req.body
        const tickets = await Ticket.findAll({where: {flightId}})
        if (tickets.length === 0) {
            return next(ApiStatus.badRequest('Нет пассажиров'))
        }
        const passports = tickets.map(ticket => ticket.dataValues.passengerPassport)
        const passengers = await Passenger.findAll({
            where: {
                passport: {
                    [Op.or]: passports
                }
            }
        })
        return res.json(passengers)
    }

}

module.exports = new PassengerController()