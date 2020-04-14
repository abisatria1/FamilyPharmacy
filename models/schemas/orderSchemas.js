const Joi = require('joi')

const orderSchema = Joi.object().keys({
    transaksi : Joi.array().items(
        Joi.object({
            id : Joi.number().required(),
            quantity : Joi.number().required()
        })
    )
})

const searchOrderSchema = Joi.object().keys({
    tanggalAwal : Joi.date().required(),
    tanggalAkhir : Joi.date().required()
})

module.exports = {
    orderSchema,
    searchOrderSchema
}