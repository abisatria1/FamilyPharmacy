const Joi = require('joi')

const userSchema = Joi.object().keys({
    namaUser : Joi.string().min(3).required(),
    umurUser : Joi.number().required(),
    alamatUser : Joi.string().required(),
    notelpUser : Joi.string().required(),
    emailUser : Joi.string().email().required(),
    username : Joi.string().min(3).required(),
    password : Joi.string().min(6).allow(''),
    statusUser : Joi.number().allow('')
})

const profileSchema = Joi.object().keys({
    namaUser : Joi.string().min(3).required(),
    umurUser : Joi.string().required(),
    alamatUser : Joi.string().required(),
    notelpUser : Joi.string().required()
})

const accountSchema = Joi.object().keys({
    emailUser : Joi.string().required(),
    username : Joi.string().min(3).required()
})

const updatePassSchema = Joi.object().keys({
    password : Joi.string().min(6).required(),
    newPassword : Joi.string().min(6).required(),
    rePassword : Joi.string().min(6).required()
})

const loginSchema = Joi.object().keys({
    param : Joi.string().min(3).required(),
    password : Joi.string().min(6).required()
})

module.exports = {
    userSchema,
    profileSchema,
    accountSchema,
    updatePassSchema,
    loginSchema
}