const User = require('../database/models/users'),
    jwt = require('jsonwebtoken'),
    dotenv = require('dotenv');
dotenv.config()

module.exports.isAuth = (req, res, next) => {
    return (req.user ? next() : res.status(401).json({
        error: {
            message: "Not logged"
        }
    }));

}

module.exports.isAdmin = (req, res, next) => {

}

module.exports.isAuthor = (req, res, next) => {

}