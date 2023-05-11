const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const basketRouter = require('./basketRouter')


router.use('/user', userRouter)
router.use('/basket', basketRouter)
router.use('/product', productRouter)

module.exports = router