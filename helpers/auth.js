const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')

// addtional
const dotenv = require('dotenv').config()
const {customError} = require('./wrapper')
const User = require('../models/User')

passport.use(new jwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : process.env.API_KEY
} , async(payload,done) => {
    try {
        console.log('asdsaaaaaaa')
        if (payload.exp <= Date.now()/1000) return done(customError('Token has expired',401))
        const user = await User.findByPk(payload.sub)
        if (!user) return done(customError('User not found' ,404))
        done(null,user)
    } catch (err) {
        console.log(err.message)
        done(err,false)
    }
}))