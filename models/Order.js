const Sequelize  = require('sequelize')
const db = require('../config/database')

const Order = db.define(
    'order',
    {
        id : {
            type : Sequelize.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        totalHarga : {
            type : Sequelize.INTEGER,
            defaultValue : 0
        },
        totalQuantity : {
            type : Sequelize.INTEGER,
            defaultValue : 0
        }
    }
)

module.exports = Order