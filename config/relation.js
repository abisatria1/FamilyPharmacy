// models
const User = require('../models/User')
const Drug = require('../models/Drug')
const Order = require('../models/Order')
const Include = require('../models/Include')
const Schedule = require('../models/Schedule')

// relasi
User.hasMany(Order)
Order.belongsTo(User)

Order.belongsToMany(Drug, {
    through : {
        model : Include,
        unique : false
    }
})
Drug.belongsToMany(Order, {
    through : {
        model : Include,
        unique :false
    }
})

User.hasMany(Schedule)
Schedule.belongsTo(User)