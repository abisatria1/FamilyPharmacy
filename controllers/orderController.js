const {customError,response} = require('../helpers/wrapper')
const dotenv = require('dotenv').config()
const Drug = require('../models/Drug')
const Order = require('../models/Order')
const User = require('../models/User')
const Include = require('../models/Include')

/* 
Menampilkan data seluruh order dengan body yang berisi tanggal awal hingga akhir
Ketentuan :
1. User harus login dan user merupakan pemilik
*/
const index = async(req,res,next) => {
    const order = await Order.findAll({
        include : [
            {model : User , attributes : ['id','namaUser']},
            {model : Drug , attributes : ['namaObat','hargaObat'] , through : {attributes : ['quantity']}}
        ],
    })
    response(res,'success',order,'All orders has been fetched',200)
}

/* 
Fungsi yang digunakan untuk memasukan data order / transaksi ke database
Ketentuan :
1. User harus login 
2. data harus berbentuk array of object [{id : 2,quantity : 30} , {id : 2,quantity : 30}]
3. data yang di submit tidak bisa di delete atau diubah
*/
const newOrder = async(req,res,next) => {
    const {transaksi} = req.body
    const {user} = req  
    const order = await Order.create({userId : user.id})
    // masukan data order
    let i = 0
    let totalHarga = 0
    let totalQuantity = 0
    let dataHasBeenInsert = []
    while (i < transaksi.length) {
        // cari obat dengan id = id
        let drug = await Drug.findByPk(transaksi[i].id)
        let qty = parseInt(transaksi[i].quantity)
        // kurangi stok obat dengan quantity yang dibeli
        drug.stokObat = drug.stokObat - qty
        // isi harga dengan rumus banyak quantity barang * harga pokok
        let harga = drug.hargaObat * qty
        // insert ke database
        let result = await order.addDrug(transaksi[i].id, {through : {quantity : qty,harga}})
        await drug.save()
        // isi data untuk pesan , totalharga dan totalQuantity
        dataHasBeenInsert.push(result[0])
        totalHarga = totalHarga + harga
        totalQuantity = totalQuantity + qty
        i++
    }
    order.totalHarga = totalHarga
    order.totalQuantity = totalQuantity
    await order.save()
    response(res,'success',dataHasBeenInsert,'All order has been recorded',201)
}


/* 
Fungsi yang digunakan untuk memasukan data order / transaksi ke database
Ketentuan :
1. User harus login dan user merupakan pemilik
2. harus memasukan tanggal awal dan akhir
3. format tanggal yyyy-mm-dd contoh 2020-04-14 (tahun 2020 bulan 04 tanggal 14)
*/
const searchOrder = async(req,res,next) => {
    const {tanggalAwal,tanggalAkhir} = req.body
    const order = await Order.findAll({
        where : {
            [Op.and] : [
                {createdAt : {[Op.gte] : `${tanggalAwal} 00:00:00`}},
                {createdAt : {[Op.lte] : `${tanggalAkhir} 23:59:59` }}
            ]
        },
        include : [
            {model : User , attributes : ['id','namaUser']},
            {model : Drug , attributes : ['namaObat','hargaObat'] , through : {attributes : ['quantity']}}
        ],
    })
    response(res,'success',order,'Orders has been fetched',200)
}

module.exports = {
    index,
    newOrder,
    searchOrder
}