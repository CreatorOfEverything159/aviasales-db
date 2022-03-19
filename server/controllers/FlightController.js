const {Flight, AirportCity} = require('../models/models')
const {Op} = require('@sequelize/core')
const ApiStatus = require('../status/ApiStatus')

class FlightController {

    async getAll(req, res, next) {
        const getCity = async (airport) => {
            const city = await AirportCity.findOne({where: {airport: airport}})
            return city.dataValues.city
        }
        const flights = await Flight.findAll()
        for (const flight of flights) {
            flight.dataValues.departureCity = await getCity(flight.departureAirport)
            flight.dataValues.destinationCity = await getCity(flight.destinationAirport)
        }
        return res.json(flights)
    }

    async search(req, res, next) {
        const getCity = async (airport) => {
            const city = await AirportCity.findOne({where: {airport: airport}})
            return city.dataValues.city
        }

        const {departureCity, destinationCity, departureDate} = req.body
        const departureAirports = await AirportCity.findAll({
            where:
                {
                    city: {[Op.substring]: departureCity}
                }
        })
        const depAir = departureAirports.map(({dataValues}) => dataValues.airport)

        const destinationAirports = await AirportCity.findAll({
            where:
                {
                    city: {[Op.substring]: destinationCity}
                }
        })
        const desAir = destinationAirports.map(({dataValues}) => dataValues.airport)
        // if (departureAirports.length === 0) {
        //     return next() // TODO Error
        // }
        // const destinationAirports = await AirportCity.findAll({where: {[Op.substring]: destinationCity}})
        // if (destinationAirports.length === 0) {
        //     return next() // TODO Error
        // }
        let date = new Date(departureDate)
        let departureDate2 = new Date(departureDate)
        departureDate2 = new Date(departureDate2.setDate(date.getDate() + 1))
        console.log(date, departureDate2)
        const flights = await Flight.findAll({
            where: {
                departureAirport: {
                    [Op.or]: depAir
                },
                destinationAirport: {
                    [Op.or]: desAir
                },
                departureDate: {
                    [Op.gte]: date,
                    [Op.lt]: departureDate2
                }
            }
        })
        for (const flight of flights) {
            flight.dataValues.departureCity = await getCity(flight.departureAirport)
            flight.dataValues.destinationCity = await getCity(flight.destinationAirport)
        }
        return res.json(flights)
    }

    async searching(req, res, next) {
        const {number, departureDate} = req.body
        let date = new Date(departureDate)
        let departureDate2 = new Date(departureDate)
        departureDate2 = new Date(departureDate2.setDate(date.getDate() + 1))
        const flights = await Flight.findAll({
            where: {
                number: {
                    [Op.substring]: number
                },
                departureDate: {
                    [Op.gte]: date,
                    [Op.lt]: departureDate2
                }
            }
        })
        return res.json(flights)
    }

    async cancel(req, res, next) {
        const {id} = req.body
        const flight = await Flight.findOne({where: {id}})
        if (!flight) {
            return next(ApiStatus.badRequest('Такого рейса не существует'))
        }
        await Flight.update({isActive: false}, {where: {id}})
        return res.json({message: 'Рейс отменен'})
    }

}

module.exports = new FlightController()
