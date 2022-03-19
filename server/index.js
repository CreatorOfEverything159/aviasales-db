require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes')
const cors = require('cors')
const {UserRole, User, Flight, AirportCity, Passenger, Ticket} = require('./models/models')
const statusHandler = require('./middleware/StatusHandligMiddleware')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)

// Errors, last Middleware
app.use(statusHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: true})

        // create roles
        await UserRole.create({role: 'Администратор'})
        await UserRole.create({role: 'Оператор'})
        await UserRole.create({role: 'Пассажир'})

        // get users roles
        const adminRole = await UserRole.findOne({where: {role: 'Администратор'}})
        const operatorRole = await UserRole.findOne({where: {role: 'Оператор'}})
        const passengerRole = await UserRole.findOne({where: {role: 'Пассажир'}})

        // create airports
        await AirportCity.create({airport: 'VVO', city: 'Владивосток'})
        await AirportCity.create({airport: 'SVO', city: 'Москва'})
        await AirportCity.create({airport: 'AER', city: 'Сочи'})
        await AirportCity.create({airport: 'LED', city: 'Санкт-Петербург'})
        await AirportCity.create({airport: 'OGZ', city: 'Владикавказ'})

        // get airport-cities
        const VVO = await AirportCity.findOne({where: {airport: 'VVO'}})
        const SVO = await AirportCity.findOne({where: {airport: 'SVO'}})
        const AER = await AirportCity.findOne({where: {airport: 'AER'}})
        const LED = await AirportCity.findOne({where: {airport: 'LED'}})
        const OGZ = await AirportCity.findOne({where: {airport: 'OGZ'}})

        // create flights
        await Flight.create({
            number: 'SU1234',
            departureDate: new Date(2022, 5, 6, 7, 30),
            departureAirport: VVO.airport,
            destinationAirport: SVO.airport,
            seatsAmount: 100,
            isActive: true
        })
        await Flight.create({
            number: 'SU1235',
            departureDate: new Date(2022, 5, 8, 18, 30),
            departureAirport: SVO.airport,
            destinationAirport: VVO.airport,
            seatsAmount: 100,
            isActive: true
        })
        await Flight.create({
            number: 'SU6666',
            departureDate: new Date(2022, 4, 8, 17, 20),
            departureAirport: VVO.airport,
            destinationAirport: OGZ.airport,
            seatsAmount: 100,
            isActive: true
        })
        await Flight.create({
            number: 'SU6667',
            departureDate: new Date(2022, 4, 9, 0, 0),
            departureAirport: OGZ.airport,
            destinationAirport: VVO.airport,
            seatsAmount: 100,
            isActive: true
        })
        await Flight.create({
            number: 'SU9090',
            departureDate: new Date(2022, 5, 7, 12, 45),
            departureAirport: AER.airport,
            destinationAirport: LED.airport,
            seatsAmount: 50,
            isActive: true
        })
        await Flight.create({
            number: 'SU9091',
            departureDate: new Date(2022, 5, 9, 23, 0),
            departureAirport: LED.airport,
            destinationAirport: AER.airport,
            seatsAmount: 50,
            isActive: true
        })

        // create passengers
        await Passenger.create({passport: '1234567890', fio: 'Иванов Иван Иванович'})
        await Passenger.create({passport: '0521832145', fio: 'Марков Андрей Владимирович'})
        await Passenger.create({passport: '1234123456', fio: 'Ким Ир Сен'})
        await Passenger.create({passport: '9999111111', fio: 'П Владимир Владимирович'})

        // create users
        await User.create({login: 'admin', password: '12345', userRoleId: adminRole.id})
        await User.create({login: 'operator', password: '12345', userRoleId: operatorRole.id})
        await User.create({login: 'passenger', password: '12345', userRoleId: passengerRole.id, passengerPassport: '0521832145'})

        // add tickets
        // await Ticket.create({flightId: 4, passengerPassport: '0521832145'})

        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
    } catch (e) {
        console.error(e)
    }
}

start().then()
