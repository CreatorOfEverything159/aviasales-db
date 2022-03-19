const Router = require('express')
const router = new Router()
const flightController = require('../controllers/FlightController')

router.get('/', flightController.getAll)
router.post('/search', flightController.search)
router.post('/cancel', flightController.cancel)

module.exports = router
