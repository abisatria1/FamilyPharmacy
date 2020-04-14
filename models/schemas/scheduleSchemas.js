const Joi = require('joi')

const scheduleSchema = Joi.object().keys({
    hari : Joi.string().required(),
    jamMasuk : Joi.string().required(),
    jamKeluar : Joi.string().required()
})

module.exports = {
    scheduleSchema
}