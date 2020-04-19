const Joi = require('joi')
const {response} = require('../wrapper')
const User = require('../../models/User')
const Drug = require('../../models/Drug')
const {comparePassword} = require('../hashHelper')

const validateBody = (schema) => {
    return (req,res,next) => {
        const result = Joi.validate(req.body,schema)
        if (result.error) return response(res,'fail',null,result.error.details[0].message,400)
        next()
    }
}

// fungsi mengecek apakah username dan email tidak ada di dalam database
const validateUsernameAndEmail = () => {
    return async(req,res,next) => {
        const {emailUser,username} = req.body
        //cek email
        const email = await User.findOne({where : {emailUser}})
        const usernameUser = await User.findOne({where : {username}})
        if (email && usernameUser) {
            return response(res,'fail',null,'email and username has been used',400)
        }
        if (email) {
            return response(res,'fail',null,'email has been used',400)
        }
        if (usernameUser) {
            return response(res,'fail',null,'username has been used',400)
        }
        next()
    }
}

const validateUsernameAndEmailOnUpdate = () => {
    return async (req,res,next) => {
        const {emailUser,username} = req.body
        const email = await User.findOne({where : {emailUser}})
        const usernameUser = await User.findOne({where : {username}})
        if (email && usernameUser) {
            if (req.params.userId) {
                if (email.id != req.params.userId && usernameUser.id != req.params.userId){
                    return response(res,'fail',null,'email and username has been used',400)
                }
            }else {
                if (email.id !== req.user.id && usernameUser.id !== req.user.id){
                    return response(res,'fail',null,'email and username has been used',400)
                }
            }
        }
        if (email) {
            if (req.params.userId) {
                if (email.id != req.params.userId){
                    return response(res,'fail',null,'email has been used',400)
                }
            }else {
                if (email.id !== req.user.id){
                    return response(res,'fail',null,'email has been used',400)
                }
            }
        }
        if (usernameUser) {
            if (req.params.userId) {
                if (usernameUser.id != req.params.userId){
                    return response(res,'fail',null,'username has been used',400)
                }
            }else {
                if (usernameUser.id !== req.user.id){
                    return response(res,'fail',null,'username has been used',400)
                }
            }
        }
        next()
    }   
}

// untuk memvalidasi apakah password sudah sesuai ketentuan atau belum
const validatePassword = () => {
    return async (req,res,next) => {
        const {password,rePassword,newPassword} = req.body
        const {user} = req
        // cek password baru dengan password lama
        const compare = comparePassword(password,user.password)
        if (!compare) return response(res,'fail',null,'Password not match with the old password',400)
        // cek password lama dengan password baru
        if (password === newPassword) return response(res,'fail',null,'New password same with the old password',400)
        // cek password dengan re-password harus sama
        if (newPassword !== rePassword) return response(res,'fail',null,'Password not match with re-password',400)
        next()
    }
}

// hanya pemilik (statusUser = 1) yang dapat melewati fungsi ini
const validateUser = () => {
    return async(req,res,next) => {
        if (req.user.statusUser == 0) return response(res,'fail',null,'You dont have permission',401)
        next()
    }
}

const validateStok = () => {
    return async (req,res,next) => {
        const {transaksi} = req.body
        let i = 0
        let error=  []
        while (i < transaksi.length) {
            let drug = await Drug.findByPk(transaksi[i].id)
            if (drug.stokObat - transaksi[i].quantity < 0) error.push(drug) 
            i++
        }
        if (error.length != 0 ) return response(res,'fail',error,'Drug out of stock',400)
        next()
    }
}

const validateTanggal = () => {
    return (req,res,next) => {
        const {tanggalAwal,tanggalAkhir} = req.body
        if (tanggalAwal > tanggalAkhir) return response(res,'fail',null,'End date must greater than start date',400)
        next()
    }
}

module.exports = {
    validateBody,
    validateUsernameAndEmail,
    validateUsernameAndEmailOnUpdate,
    validatePassword,
    validateUser,
    validateStok,
    validateTanggal
}