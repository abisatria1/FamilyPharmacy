const router = require('express-promise-router')()
const drugController = require('../controllers/drugController')
const {drugSchema} = require('../models/schemas/drugSchemas')
const {validateBody} = require('../helpers/validator/validateBody')
const {upload} = require('../helpers/uploadHelper')

router.route('/')
    .get(drugController.index)
    .post(upload.single('fotoObat') ,validateBody(drugSchema),drugController.createDrug)

router.route('/search').post(drugController.searchDrug)

router.route('/:drugId')
    .get(drugController.viewDrugDetail)
    .delete(drugController.deleteDrug)
    .patch(validateBody(drugSchema),drugController.updateDrug)


module.exports = router