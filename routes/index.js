const {Router} = require('express')
const db_connect = require('../database/DB_connection')
const { v4: uuidv4 } = require('uuid');

module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', function(req, res) {
            if (req.user) {
                res
                    .status(200)
                    .send(req.user)
            }else{
                res
                    .status(200)
                    .json({test: "index bg"})
            }
        });
        this.get('/test', function(req, res) {
            res
                .status(200)
                .json({test: "test 2"})
        });
        this.get('/test/1337', function(req, res) {
            res
                .status(200)
                .json({test: "test 1337"})
        });
        this.get('/generate', function (req, res) {
            db_connect.models.item_list.findOrCreate({
                where: {
                    itemID: uuidv4(),
                    itemName: "Toyota Supra",
                    itemDescription: "SUPRAAAAA",
                }
            })
            db_connect.models.item_list.findOrCreate({
                where: {
                    itemID: uuidv4(),
                    itemName: "Cookie miner",
                    itemDescription: "that's a cookie miner, it gives you free cookies"
                }
            })
            db_connect.models.users.findOrCreate({
                where: {
                    userID: uuidv4(),
                    money: 1500,
                }
            })
            res
                .status(200)
                .json({msg: "gg"})

        })
        this.get('/test/key', function(req, res) {

            db_connect.models.user_items.findOrCreate({
                where: {
                    userID: "5718329d-79c5-4a61-80fe-0",
                    itemID: "9302a9ca-8bc9-4f27-ba32-e",
                }
            })
                .then((ui) => {
                    res
                        .status(200)
                        .json({test: "key success"})
                })
                .catch((e) => {
                    res
                        .status(500)
                        .json({message: "error while creating user_item"})
                })
        });
    }
}

module.exports.name = '/';