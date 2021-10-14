const passport = require("passport"),
    User = require('../database/models/users');
const {where} = require("sequelize");

//serializing user in session with the user id
passport.serializeUser((user, done) => {
    console.log("serialize")
    done(null, user.userID)
})

//deserializing user in session using the user id to find full user infos
passport.deserializeUser((id, done) => {
    console.log("deserialize")
    User.findOne({where: {userID: id}})
        .then((user) => {
            done(null, user)
        })
})