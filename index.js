const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./config/database')
const userRoute = require('./routes/userRoute')
const dotenv = require('dotenv').config()
const {response} = require('./helpers/wrapper')

// global variable
global.Sequelize = require('sequelize')
global.Op = global.Sequelize.Op

// models
const User = require('./models/User')

// middleware

// bodyParser
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

// routes
app.use('/users' , userRoute)

app.use((req,res,next) => {
    const error = new Error('Request not found')
    error.status = 404
    next(error)
})

app.use ( (err,req,res,next) => {
    const error = err.message || 'Internal server error'
    const status = err.status || 500
    response(res,'fail',null,error,status)
})

// running app
const port = process.env.PORT || 3000
app.listen(port , () => {
    // connect database 
    db.sync({})
    .then (() => {
        console.log('db is sync')
        console.log(`port is running in port ${port}`)
    })
    .catch(err => console.log(err.message))
})