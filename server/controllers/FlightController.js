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
        const dateToUtcDate = (date) => {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 20, date.getMinutes()))
        }

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
        if (depAir.length === 0) {
            return next(ApiStatus.badRequest('Не существует такого города вылета'))
        }
        const destinationAirports = await AirportCity.findAll({
            where:
                {
                    city: {[Op.substring]: destinationCity}
                }
        })
        const desAir = destinationAirports.map(({dataValues}) => dataValues.airport)
        if (desAir.length === 0) {
            return next(ApiStatus.badRequest('Не существует такого города назначения'))
        }
        let date = new Date(departureDate)
        let departureDate2 = new Date(departureDate)
        departureDate2 = new Date(departureDate2.setDate(date.getDate() + 1))
        let flights
        if (date == 'Invalid Date') {
            flights = await Flight.findAll({
                where: {
                    departureAirport: {
                        [Op.or]: depAir
                    },
                    destinationAirport: {
                        [Op.or]: desAir
                    }
                }
            })
        } else {
            flights = await Flight.findAll({
                where: {
                    departureAirport: {
                        [Op.or]: depAir
                    },
                    destinationAirport: {
                        [Op.or]: desAir
                    },
                    departureDate: {
                        [Op.gte]: dateToUtcDate(date),
                        [Op.lt]: dateToUtcDate(departureDate2)
                    }
                }
            })
        }
        for (const flight of flights) {
            flight.dataValues.departureCity = await getCity(flight.departureAirport)
            flight.dataValues.destinationCity = await getCity(flight.destinationAirport)
        }
        return res.json(flights)
    }

    async searching(req, res, next) {
        const dateToUtcDate = (date) => {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 20, date.getMinutes()))
        }

        const {number, departureDate} = req.body
        let date = new Date(departureDate)
        let departureDate2 = new Date(departureDate)
        departureDate2 = new Date(departureDate2.setDate(date.getDate() + 1))
        console.log(date, '<= x <', departureDate2)

        console.log(dateToUtcDate(date), '<= x <', dateToUtcDate(departureDate2))
        let flights
        if (date == 'Invalid Date') {
            flights = await Flight.findAll({
                where: {
                    number: {
                        [Op.substring]: number
                    }
                }
            })
        } else {
            flights = await Flight.findAll({
                where: {
                    number: {
                        [Op.substring]: number
                    },
                    departureDate: {
                        [Op.gte]: dateToUtcDate(date),
                        [Op.lt]: dateToUtcDate(departureDate2)
                    }
                }
            })
        }
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

    async create(req, res, next) {
        const dateToUtcDate = (date) => {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 20, date.getMinutes()))
        }

        const {number, departureAirport, destinationAirport, departureDate, seatsAmount} = req.body
        const depAirport = await AirportCity.findOne({where: {airport: departureAirport}})
        if (!depAirport) {
            return next(ApiStatus.badRequest(`Такого аэропорта вылета не существует`))
        }
        const desAirport = await AirportCity.findOne({where: {airport: destinationAirport}})
        if (!desAirport) {
            return next(ApiStatus.badRequest(`Такого аэропорта назначения не существует`))
        }
        let dateFrom = `${departureDate}`.slice(0, 10)
        dateFrom = new Date(dateFrom)
        let dateTo = new Date(dateFrom)
        dateTo = new Date(dateTo.setDate(dateFrom.getDate() + 1))
        console.log(dateFrom, '<>', dateTo)
        const flights = await Flight.findAll({
            where: {
                number: {
                    [Op.eq]: number
                },
                departureDate: {
                    [Op.gte]: dateToUtcDate(dateFrom),
                    [Op.lt]: dateToUtcDate(dateTo)
                }
            }
        })
        console.log(flights)
        if (flights.length !== 0) {
            return next(ApiStatus.badRequest(`Рейс уже существует`))
        }
        let newDate = new Date(departureDate)
        await Flight.create({
            number,
            departureDate: newDate,
            departureAirport,
            destinationAirport,
            seatsAmount,
            isActive: true
        })
        return res.json({message: 'Рейс успешно создан'})
    }

}

module.exports = new FlightController()
