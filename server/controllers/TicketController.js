const {Ticket} = require('../models/models')

class TicketController {

    async addTicket(req, res, next) {
        const {flightId, passengerPassport} = req.body
        let ticket = await Ticket.findOne({where: {flightId, passengerPassport}})
        if (ticket) {
            return next() // TODO Error
        }
        ticket = await Ticket.create({flightId, passengerPassport})
        return res.json(ticket)
    }

    async removeTicket(req, res, next) {
        const {flightId, passengerPassport} = req.body
        let ticket = await Ticket.findOne({where: {flightId, passengerPassport}})
        if (!ticket) {
            return next() // TODO Error
        }
        await ticket.destroy()
        return res.json({message: 'Бронирование отменено'})
    }

}

module.exports = new TicketController()