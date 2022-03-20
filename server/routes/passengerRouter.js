const Router = require('express')
const router = new Router()
const passengerController = require('../controllers/PassengerController')

router.post('/', passengerController.passengersByFlight)

module.exports = router