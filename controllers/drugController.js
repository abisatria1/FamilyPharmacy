const Drug = require('../models/Drug')
const {customError,response} = require('../helpers/wrapper')
const dotenv = require('dotenv').config()
const fs = require('fs')

/*
fungsi yang digunakan untuk melihat seluruh data obat
ketentuan : 1. user harus login
*/
const index = async(req,res,next) => {
    const drug = await Drug.findAll()
    response(res,'success',drug,'All drugs data has been fetched',200)
}

/*
fungsi yang digunakan untuk menambahkan data obat
ketentuan : 1. user harus login
*/
const createDrug = async(req,res,next) => {
    req.body.fotoObat = "http://localhost:3001/" + req.file.path
    const drug = await Drug.create(req.body)
    response(res,'success',drug,'Drug has been created',201)
}

/*
fungsi yang digunakan untuk melihat obat secara spesifik (salah satu obat saja) dengan id obat
ketentuan : 1. user harus login
*/
const viewDrugDetail = async(req,res,next) => {
    const drug = await Drug.findByPk(req.params.drugId)
    if (!drug) return response(res,'fail',null,'Drug not found',400)
    response(res,'success',drug,'Drug has been fetched',200)
}

/*
fungsi yang digunakan untuk menghapus data obat dengan id obat
ketentuan : 1. user harus login
*/
const deleteDrug = async(req,res,next) => {
    const deleteDrug = await Drug.findByPk(req.params.drugId)
    if (!deleteDrug) response(res,'fail',null,'Drug not found',400)
    const filePath = deleteDrug.fotoObat
    const arrPath = filePath.split('/')
    fs.unlink(arrPath[3] , err => {
        if (err) return response(res,'fail',null,'Error delete image on local storage',500)
    })
    await deleteDrug.destroy()    
    response(res,'success',null,'Drug has been delete',200)
}

/*
fungsi yang digunakan untuk mengupdate data obat dengan id obat
ketentuan : 1. user harus login
*/
const updateDrug = async(req,res,next) => {
    const {
        namaObat,
        jenisObat,
        produsenObat,
        stokObat,
        hargaObat,
        descObat
    } = req.body
    const drug = await Drug.findByPk(req.params.drugId)
    if (!drug) return response(res,'fail',null,'Drug not found',400)
    drug.namaObat = namaObat
    drug.jenisObat = jenisObat
    drug.produsenObat = produsenObat
    drug.stokObat = stokObat
    drug.hargaObat = hargaObat
    drug.descObat = descObat
    await drug.save()
    response(res,'success',drug,'Drug has been update',200)
}

/*
fungsi yang digunakan untuk mencari data obat berdasarkan param
ketentuan : 1. user harus login
*/
const searchDrug = async (req,res,next) => {
    const {param} = req.body
    const drugs = await Drug.findAll({
        where : {
            [Op.or] : [
                {namaObat : {[Op.like] : `%${param}%`}},
                {jenisObat : {[Op.like] : `%${param}%`}},
                {produsenObat : {[Op.like] : `%${param}%`}},
                {stokObat : {[Op.like] : `%${param}%`}},
                {hargaObat : {[Op.like] : `%${param}%`}},
                {descObat : {[Op.like] : `%${param}%`}},
            ]
        }
    })
    response(res,'success',drugs,'All drugs has been fetched',200)
}

module.exports = {
    index,
    createDrug,
    viewDrugDetail, 
    deleteDrug,
    updateDrug,
    searchDrug
}