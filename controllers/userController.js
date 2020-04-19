const User = require('../models/User')
const {customError,response} = require('../helpers/wrapper')
const {hashPassword,comparePassword} = require('../helpers/hashHelper')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const signToken = user => {
    return  token = jwt.sign({
        iss : 'abisatria',
        sub : user.id,
        iat : Date.now()
    } , process.env.API_KEY , {expiresIn : '24h'})
}

const index = async(req,res,next) => {
    const users = await User.findAll()
    response(res,'success',users,'All users has been fetched' ,200)
}

const createUser = async(req,res,next) => {
    // hash password
    if (req.body.password === '' || req.body.password === undefined) {
        req.body.password = hashPassword("123456")
    }else {
        req.body.password = hashPassword(req.body.password)
    }
    const user = new User (req.body)
    await user.save()
    response(res,'success',user,'User has been create' ,201)
}

const showUser = async(req,res,next) => {
    response(res,'success',req.user,'User has been fetched' ,200)
}

const deleteUser = async(req,res,next) => {
    const user = await User.destroy({where : {id : req.params.userId}})
    console.log(user)
    if (user == 0) return next(customError('Failed delete user or user not found' , 400))
    response(res,'success',null,'User has been deleted' ,200)
}

const updateProfile = async(req,res,next) => {
    const {namaUser,umurUser,alamatUser,notelpUser} = req.body
    const {user} = req
    user.namaUser = namaUser
    user.umurUser = umurUser
    user.alamatUser = alamatUser
    user.notelpUser = notelpUser
    await user.save()
    response(res,'success' ,user,'Successfully update profile data',200)
}

const updateAccount = async(req,res,next) => {
    const {emailUser,username} = req.body
    const {user} = req
    user.emailUser = emailUser,
    user.username = username
    await user.save()
    response(res,'success' ,user,'Successfully update account data',200)
}

const updatePassword = async(req,res,next) => {
    // hash password
    const password = hashPassword(req.body.newPassword)
    const {user} = req
    user.password = password
    await user.save()
    response(res,'success' ,null,'Successfully update password data',200)
}

const login = async (req,res,next) => {
    const {param,password} = req.body
    // check param
    const user = await User.findOne({
        where : {
            [Op.or] : [
                {username : param},
                {emailUser : param}
            ]
        }
    })
    if (!user) return next(customError('Email or username not valid',401))
    const compare = comparePassword(password,user.password)
    if (!compare) return next(customError('Password not valid',401))
    // set token
    const token = signToken(user)
    response(res,'success',{token},'Login successfull',200)
}

const searchUser = async(req,res,next) => {
    const {param} = req.body
    const user = await User.findAll({
        where : {
            [Op.or] : [
                {namaUser : {[Op.like] : `%${param}%`}},
                {umurUser : {[Op.like] : `%${param}%`}},
                {alamatUser : {[Op.like] : `%${param}%`}},
                {notelpUser : {[Op.like] : `%${param}%`}},
                {emailUser : {[Op.like] : `%${param}%`}},
                {username : {[Op.like] : `%${param}%`}}
            ]
        }
    })
    response(res,'success',user,'All users has been fetched',200)
}

const resetPassword = async (req,res,next) => {
    const user = await User.findByPk(req.params.userId)
    if (!user) return response(res,'fail',null,'User not found',400)
    const password = hashPassword('123456')
    user.password = password
    await user.save()
    response(res,'success',user,'User password has been reset to 123456',200)
}

const editUserByOwner = async (req,res,next) => {
    const {namaUser,umurUser,notelpUser,alamatUser,emailUser,username,statusUser} = req.body
    const user = await User.findByPk(req.params.userId)
    if (!user) return response(res,'fail',null,'User not found',400)
    user.namaUser = namaUser
    user.umurUser = umurUser
    user.notelpUser = notelpUser
    user.alamatUser = alamatUser
    user.emailUser = emailUser
    user.username = username
    user.statusUser = statusUser
    await user.save()
    response(res,'success' ,null,'Successfully update user data',200)
}


module.exports = {
    index,
    createUser,
    showUser,
    deleteUser,
    updateProfile,
    updateAccount,
    updatePassword,
    login,
    searchUser,
    resetPassword,
    editUserByOwner
}