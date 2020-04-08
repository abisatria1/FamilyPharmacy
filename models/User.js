const Sequelize = require('sequelize')
const db = require('../config/database')

const User = db.define(
    'user',
    {
        namaUser : {
            type : Sequelize.STRING,
            allowNull : false
        },
        umurUser : {
            type : Sequelize.INTEGER
        },
        alamatUser : {
            type : Sequelize.STRING,
            allowNull : false
        },
        notelpUser : {
            type : Sequelize.STRING,
            allowNull : false
        },
        emailUser : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        username : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        password : {
            type : Sequelize.STRING,
            allowNull : false
        },
        statusUser : {
            type : Sequelize.SMALLINT,
            defaultValue : 0
        }
    }
)

module.exports = User