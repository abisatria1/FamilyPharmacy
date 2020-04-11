const Sequelize = require('sequelize')
const db = require('../config/database')

const Drug = db.define(
    'drug',
    {
        namaObat : {
            type : Sequelize.STRING,
            allowNull : false
        },
        jenisObat : {
            type : Sequelize.STRING,
            allowNull : false
        },
        produsenObat : {
            type : Sequelize.STRING
        },
        stokObat : {
            type : Sequelize.SMALLINT,
            defaultValue : 0
        },
        hargaObat : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        fotoObat : {
            type : Sequelize.STRING,
            defaultValue : 'noPhoto.jpg'
        }
    }
)

module.exports = Drug