const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')

router.get('/check', userController.check)
router.post('/login', userController.authorization)
router.post('/reg', userController.registration)

module.exports = router
