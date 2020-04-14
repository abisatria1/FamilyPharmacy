const router = require('express-promise-router')()
const orderController = require('../controllers/orderController')
const {orderSchema,searchOrderSchema} = require('../models/schemas/orderSchemas')
const {validateBody,validateStok,validateTanggal,validateUser} = require('../helpers/validator/validateBody')

router.route('/')
    .get(validateUser(),orderController.index)
    .post([validateBody(orderSchema),validateStok()],orderController.newOrder)

router.route('/search')
    .get([validateUser(),validateBody(searchOrderSchema),validateTanggal()],orderController.searchOrder)
module.exports = router