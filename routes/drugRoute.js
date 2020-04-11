const router = require('express-promise-router')()
const drugController = require('../controllers/drugController')
const {drugSchema} = require('../models/schemas/drugSchemas')
const {validateBody} = require('../helpers/validator/validateBody')

router.route('/')
    .get(drugController.index)
    .post(validateBody(drugSchema),drugController.createDrug)

router.route('/:drugId')
    .get(drugController.viewDrugDetail)
    .delete(drugController.deleteDrug)
    .patch(validateBody(drugSchema),drugController.updateDrug)

module.exports = router