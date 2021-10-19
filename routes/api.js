const {Router} = require('express');
const passport = require('passport');
const sequelize = require('../database/DB_connection');
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const {log} = require("nodemon/lib/utils");

module.exports.Router = class Auth extends Router {
    constructor() {
        super();
        this.get('/', (req, res) => {
            // If user goes on /auth/ redirect him to main page
            res.redirect('../');
        })

        this.get("/user/top", async (req, res) => {
            let top = await req.db.models.users.findAll({
                limit: 10,
                order: [Sequelize.col('MONEY')],
            })
            res
                .status(200)
                .json({top: top})
        })

        this.get("/:user/seemoney", async (req, res) => {
            const userID = req.params.user;
            let user = await req.db.models.users.findOrCreate({
                where: {
                    userID: userID
                }
            })
            res.status(200).json({
                message: "added money with success",
                money: user.money
            })
        })

        this.post("/:user/money/add", async (req, res) => {
            const userID = req.params.user;
            let user = await req.db.models.users.findOrCreate({
                where: {
                    userID: userID
                }
            })
            if (user) {
                user = await req.db.models.users.findOne({
                    where: {
                        userID: userID
                    }
                })
                user.money += parseInt(req.body.money);
                await user.save()
                res.status(200).json({
                    message: "added money with success",
                    user: user
                })
            }
        })

        this.post("/:user/money/remove", async (req, res) => {
            const userID = req.params.user;
            let user = await req.db.models.users.findOrCreate({
                where: {
                    userID: userID
                }
            })
            if (user) {
                user = await req.db.models.users.findOne({
                    where: {
                        userID: userID
                    }
                })
                user.money -= parseInt(req.body.money);
                await user.save()
                res.status(200).json({
                    message: "removed money with success",
                    user: user
                })
            }
        })

        this.post("/shop/buy", async (req, res) => {
            const userID = req.body.userID;
            const itemID = req.body.itemID;

            req.db.models.user_items.create({
                userID: userID,
                itemID: itemID
            })
                .then(() => {
                    res.status(200).json({
                        message: "Item bought with success"
                    })
                })
                .catch((e) => {
                    res.status(500).json({ message: "Error while buying the game" })
                    console.log(e)
                })
        })
    }
};

module.exports.name = '/api';