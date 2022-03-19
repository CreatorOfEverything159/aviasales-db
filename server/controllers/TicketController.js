const {Ticket, Flight} = require('../models/models')
const ApiStatus = require("../status/ApiStatus");

class TicketController {

    async addTicket(req, res, next) {
        const {flightId, passengerPassport} = req.body
        let ticket = await Ticket.findOne({where: {flightId, passengerPassport}})
        if (ticket) {
            return next(ApiStatus.badRequest(`Пользователь ${login} не найден`)) // TODO Error
        }
        const flight = await Flight.findOne({where: {id: flightId}})
        await Flight.update({seatsAmount: flight.seatsAmount - 1}, {where: {id: flightId}})
        ticket = await Ticket.create({flightId, passengerPassport})
        return res.json(ticket)
    }

    async removeTicket(req, res, next) {
        const {flightId, passengerPassport} = req.body
        let ticket = await Ticket.findOne({where: {flightId, passengerPassport}})
        if (!ticket) {
            return next() // TODO Error
        }
        const flight = await Flight.findOne({where: {id: flightId}})
        await Flight.update({seatsAmount: flight.seatsAmount + 1}, {where: {id: flightId}})
        await ticket.destroy()
        return res.json({message: 'Бронирование отменено'})
    }

}

module.exports = new TicketController()
