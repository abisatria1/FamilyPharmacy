const Sequelize = require('sequelize')
const db = require('../config/database')

const Schedule = db.define(
    'schedule',
    {
        hari : {
            type : Sequelize.STRING,
            allowNull : false
        },
        jamMasuk : {
            type : Sequelize.TIME,
            allowNull : false
        },
        jamKeluar : {
            type : Sequelize.TIME,
            allowNull : false
        }
    }
)

module.exports = Schedule