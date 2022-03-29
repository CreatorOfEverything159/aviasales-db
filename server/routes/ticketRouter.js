const Router = require('express')
const router = new Router()
const ticketController = require('../controllers/TicketController')

router.post('/add', ticketController.addTicket)
router.post('/remove', ticketController.removeTicket)

module.exports = router