const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const flightRouter = require('./flightRouter')
const airportCityRouter = require('./airportCityRouter')
const passengerRouter = require('./passengerRouter')
const ticketRouter = require('./ticketRouter')
const userRoleRouter = require('./userRoleRouter')

router.use('/user', userRouter)
router.use('/user-role', userRoleRouter)
router.use('/airport-city', airportCityRouter)
router.use('/passenger', passengerRouter)
router.use('/ticket', ticketRouter)
router.use('/flight', flightRouter)

module.exports = router
