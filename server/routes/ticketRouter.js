const Router = require('express')
const router = new Router()
const ticketController = require('../controllers/TicketController')

router.get('/', ticketController.getAll)

module.exports = router