const {Flight, AirportCity} = require('../models/models')

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

}

module.exports = new FlightController()