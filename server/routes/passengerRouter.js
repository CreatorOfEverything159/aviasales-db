const Router = require('express')
const router = new Router()
const passengerController = require('../controllers/PassengerController')

router.get('/', passengerController.getAll)

module.exports = router