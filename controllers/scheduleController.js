const {customError,response} = require('../helpers/wrapper')
const dotenv = require('dotenv').config()
const User = require('../models/User')
const Schedule = require('../models/Schedule')

const index = async (req,res,next) => {
    const user = await User.findByPk(req.params.userId)
    if (!user) return response(res,'fail',null,'User not found',400)
    const schedule =  await user.getSchedules() 
    response(res,'success',schedule,'All schedules has been fetched',200)
}

const getSchedule = async(req,res,next) => {
    const {user} = req
    const schedule = await user.getSchedules()
    response(res,'success',schedule,'All schedules has been fetched',200)
}

const createSchedule = async(req,res,next) => {
    req.body.userId = req.params.userId
    const schedule = await Schedule.create(req.body)
    response(res,'success',schedule,'Schedule has been create',201)
}

const updateSchedule = async(req,res,next) => {
    const {hari,jamMasuk,jamKeluar} = req.body
    const schedule = await Schedule.findByPk(req.params.scheduleId)
    if (!schedule) return response(res,'fail',"",'Schedule not found',400)
    schedule.hari = hari
    schedule.jamMasuk = jamMasuk
    schedule.jamKeluar = jamKeluar
    const result = await schedule.save()
    response(res,'success',result,'Schedule has been update',200)
}

const deleteSchedule = async(req,res,next) => {
    const {userId,scheduleId} = req.params
    await Schedule.destroy({
        where : {
            [Op.and] : [
                {id : scheduleId},
                {userId}
            ]
        }
        
    })
    response(res,'success',"",'Schedule has been deleted',200)
}

module.exports = {
    index,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule
}
