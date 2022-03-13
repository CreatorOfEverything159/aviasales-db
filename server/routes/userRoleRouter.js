const Router = require('express')
const router = new Router()
const userRoleController = require('../controllers/UserRoleController')

router.get('/', userRoleController.getAll)

module.exports = router