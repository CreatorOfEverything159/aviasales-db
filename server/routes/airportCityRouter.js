const Router = require('express')
const router = new Router()
const airportCityController = require('../controllers/AirportCityController')

router.get('/', airportCityController.getAll)

module.exports = router