const Joi = require('joi')

const drugSchema = Joi.object().keys({
    namaObat : Joi.string().min(3).required(),
    jenisObat : Joi.string().min(3).required(),
    produsenObat : Joi.string().required(),
    stokObat : Joi.number().required(),
    hargaObat : Joi.number().required(),
    fotoObat : Joi.string().required()
})


module.exports = {
    drugSchema
}