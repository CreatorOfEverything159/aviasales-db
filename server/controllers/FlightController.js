const {Flight, AirportCity} = require('../models/models')
const { Op } = require('@sequelize/core')

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
        const departureAirports = await AirportCity.findAll({where:
                {
                    city: {[Op.substring]: departureCity}
                }
        })
        const depAir = departureAirports.map(({dataValues}) => dataValues.airport)

        const destinationAirports = await AirportCity.findAll({where:
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
        const flights = await Flight.findAll({where: {
                departureAirport: {
                    [Op.or]: depAir
                },
                destinationAirport: {
                    [Op.or]: desAir
                },
                departureDate: {
                    [Op.gte]: departureDate
                }
            }
        })
        for (const flight of flights) {
            flight.dataValues.departureCity = await getCity(flight.departureAirport)
            flight.dataValues.destinationCity = await getCity(flight.destinationAirport)
        }
        return res.json(flights)
    }

}

module.exports = new FlightController()
