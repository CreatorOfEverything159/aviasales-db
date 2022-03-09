const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/user-role', )
router.use('/airport-city', )
router.use('/passenger', )
router.use('/ticket', )
router.use('/flight', )

module.exports = router
