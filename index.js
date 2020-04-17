const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./config/database')
const dotenv = require('dotenv').config()
const {response} = require('./helpers/wrapper')
const Sequelize = require('sequelize')
const passport = require('passport')
const auth = require('./helpers/auth')
const cors = require('cors')
// routes
const userRoute = require('./routes/userRoute')
const drugRoute = require('./routes/drugRoute')
const orderRoute = require('./routes/orderRoute')
const scheduleRoute = require('./routes/scheduleRoute')

var allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:3001",
    "bot-linecoba.herokuapp.com"
]

app.use(
    cors({
        origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
        }
    })
)

// global variable
global.Op = Sequelize.Op


// relation
const relation = require('./config/relation')



// middleware
// bodyParser
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

// routes
app.use('/users' , userRoute)
app.use('/orders' , passport.authenticate('jwt', {session : false}), orderRoute)
app.use('/drugs', passport.authenticate('jwt', {session : false}) , drugRoute)
app.use('/schedules', passport.authenticate('jwt', {session : false}) , scheduleRoute)

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