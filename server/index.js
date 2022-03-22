require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes')
const cors = require('cors')
const {UserRole, User, Flight, AirportCity, Passenger, Ticket} = require('./models/models')
const statusHandler = require('./middleware/StatusHandligMiddleware')

// process.env.TZ = 'Asia/Vladivostok'

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
        await sequelize.sync({force: true})

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
        await AirportCity.create({airport: 'ABC', city: 'Албасет'})
        await AirportCity.create({airport: 'ZAH', city: 'Захедан'})
        await AirportCity.create({airport: 'MEB', city: 'Мельбурн'})

        // get airport-cities
        const VVO = await AirportCity.findOne({where: {airport: 'VVO'}})
        const SVO = await AirportCity.findOne({where: {airport: 'SVO'}})
        const AER = await AirportCity.findOne({where: {airport: 'AER'}})
        const LED = await AirportCity.findOne({where: {airport: 'LED'}})
        const OGZ = await AirportCity.findOne({where: {airport: 'OGZ'}})
        const ABC = await AirportCity.findOne({where: {airport: 'ABC'}})
        const ZAH = await AirportCity.findOne({where: {airport: 'ZAH'}})
        const MEB = await AirportCity.findOne({where: {airport: 'MEB'}})

        const airports = [VVO, SVO, AER, LED, OGZ, ABC, ZAH, MEB]

        // create flights
        for (let i = 10; i < 99; i++) {
            await Flight.create({
                number: `AA00${i}`,
                departureDate: new Date(2022, 2, i, i, i),
                departureAirport: airports[i % airports.length].airport,
                destinationAirport: airports[(i + Math.floor(Math.random() * (airports.length - 1)) + 1) % airports.length].airport,
                seatsAmount: 50,
                isActive: true
            })
        }

        // create passengers
        await Passenger.create({passport: '0521111111', fio: 'Курочкин Марк Михайлович'})
        await Passenger.create({passport: '0521222222', fio: 'Богомолов Демид Маркович'})
        await Passenger.create({passport: '0521333333', fio: 'Ананьев Александр Владимирович'})
        await Passenger.create({passport: '0521444444', fio: 'Тихонова Виктория Марковна'})
        await Passenger.create({passport: '0521555555', fio: 'Филимонова Мария Артемьевна'})
        await Passenger.create({passport: '0521666666', fio: 'Антипов Александр Андреевич'})
        await Passenger.create({passport: '0521777777', fio: 'Шувалов Дмитрий Матвеевич'})
        await Passenger.create({passport: '0521888888', fio: 'Коровина Яна Марковна'})
        await Passenger.create({passport: '0521999999', fio: 'Попов Андрей Кириллович'})
        await Passenger.create({passport: '0521000000', fio: 'Кочетков Антон Григорьевич'})
        await Passenger.create({passport: '0521121212', fio: 'Поляков Ярослав Александрович'})
        await Passenger.create({passport: '0521909090', fio: 'Лапшин Александр Матвеевич'})

        // create users
        await User.create({login: 'admin', password: '1234', userRoleId: adminRole.id})
        await User.create({login: 'oper1', password: '1234', userRoleId: operatorRole.id})
        await User.create({login: 'oper2', password: '1234', userRoleId: operatorRole.id})
        await User.create({login: 'oper3', password: '1234', userRoleId: operatorRole.id})
        await User.create({login: 'oper4', password: '1234', userRoleId: operatorRole.id})
        await User.create({
            login: 'pass1',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521111111'
        })
        await User.create({
            login: 'pass2',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521222222'
        })
        await User.create({
            login: 'pass3',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521333333'
        })
        await User.create({
            login: 'pass4',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521444444'
        })
        await User.create({
            login: 'pass5',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521555555'
        })
        await User.create({
            login: 'pass6',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521666666'
        })
        await User.create({
            login: 'pass7',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521777777'
        })
        await User.create({
            login: 'pass8',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521888888'
        })
        await User.create({
            login: 'pass9',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521999999'
        })
        await User.create({
            login: 'pass10',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521000000'
        })
        await User.create({
            login: 'pass11',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521121212'
        })
        await User.create({
            login: 'pass12',
            password: '1234',
            userRoleId: passengerRole.id,
            passengerPassport: '0521909090'
        })

        const passengers = await Passenger.findAll()

        for (const passenger of passengers) {
            let randomFlightIds = []
            const randFlightsCount = Math.floor(Math.random() * 89) + 1
            for (let i = 0; i < randFlightsCount; i++) {
                let randomId = Math.floor(Math.random() * 89) + 1
                if (!randomFlightIds.includes(randomId)) {
                    randomFlightIds.push(randomId)
                    await Ticket.create({flightId: randomId, passengerPassport: passenger.dataValues.passport})
                    await Flight.decrement({seatsAmount: 1}, {where: {id: randomId}})
                }
            }
        }

        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
    } catch (e) {
        console.error(e)
    }
}

start().then()
