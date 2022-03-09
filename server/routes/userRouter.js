const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')

router.post('/login', userController.login)
router.post('/reg', userController.registration)

router.get('/check', userController.check)

module.exports = router
