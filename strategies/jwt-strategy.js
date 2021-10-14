const passport = require("passport"),
    dotenv = require('dotenv'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('../database/models/users');
dotenv.config();

// Options for the strategy
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.WEBTOKEN_SECRET,
    algorithms: ['HS256']
}

// Creation of the JWT strategry
passport.use(new JwtStrategy(options, (payload, done) => {
    // Try to find a user with the payload's infos
    //todo correct db connect
    User.findOne({
        type: payload.type, _id: payload.userId
    }, ((error, user) => {
        // If error return the error
        if (error) return done(error, false)
        // else return the user
        else return done(null, user)
    }))
}))