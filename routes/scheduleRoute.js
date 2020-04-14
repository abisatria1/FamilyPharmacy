const router = require('express-promise-router')()
const scheduleController = require('../controllers/scheduleController')
const {scheduleSchema} = require('../models/schemas/scheduleSchemas')
const {validateBody,validateUser} = require('../helpers/validator/validateBody')


router.route('/getSchedule')
    .get(scheduleController.getSchedule)
    
router.route('/:userId')
    .get(scheduleController.index)
    .post(validateUser(),validateBody(scheduleSchema), scheduleController.createSchedule)

router.route('/:userId/:scheduleId') 
    .delete(validateUser(), scheduleController.deleteSchedule)
    .patch([validateUser(), validateBody(scheduleSchema)], scheduleController.updateSchedule)


module.exports = router