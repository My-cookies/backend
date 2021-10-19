const {Router} = require('express');
const passport = require('passport');
const sequelize = require('../database/DB_connection');
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const {log} = require("nodemon/lib/utils");

const { buy } = require('../controllers/shopSide.controller')
const {
    getTop,
    seeUserMoney,
    userMoneyAdd,
    userMoneyRemove,
    userDonate
} = require('../controllers/botSide.controller')

module.exports.Router = class Api extends Router {
    constructor() {
        super();
        this.get('/', (req, res) => {
            // If user goes on /auth/ redirect him to main page
            res.redirect('../');
        })

        // bot side routes
        this.get("/user/top", getTop)
        this.get("/:user/seemoney", seeUserMoney)
        this.post("/:user/money/add", userMoneyAdd)
        this.post("/:user/money/remove", userMoneyRemove)
        this.put("/donate", userDonate)

        //site side routes
        this.post("/shop/buy", buy)
    }
};

module
    .exports
    .name = '/api';