const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/check', authMiddleware, userController.check)
router.post('/login', userController.authorization)
router.post('/reg',  userController.registration)
router.post('/users',  userController.getUsers)
router.post('/remove',  userController.removeUsers)
router.post('/user',  userController.getUser)
router.post('/search',  userController.searchUser)
router.post('/reg-user',  userController.regUser)
router.post('/change',  userController.changeUser)

module.exports = router
