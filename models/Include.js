const Sequelize = require('sequelize')
const db = require('../config/database')

const Include = db.define(
    'include',
    {
        id : {
            type : Sequelize.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        quantity : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        harga : {
            type : Sequelize.INTEGER
        }
    }
)

module.exports = Include