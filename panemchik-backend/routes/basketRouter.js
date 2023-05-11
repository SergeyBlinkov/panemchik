const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')
const {getBasket,newItem} = basketController

router.post('/newItem',newItem)
router.get('/basket',getBasket)

module.exports = router