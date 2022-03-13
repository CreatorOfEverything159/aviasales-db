const Router = require('express')
const router = new Router()
const flightController = require('../controllers/FlightController')

router.get('/', flightController.getAll)

module.exports = router