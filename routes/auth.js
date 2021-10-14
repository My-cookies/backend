const {Router} = require('express');
const passport = require('passport');
const sequelize = require('../database/DB_connection');
const jwt = require('jsonwebtoken')

module.exports.Router = class Auth extends Router {
    constructor() {
        super();
        this.get('/', (req, res) => {
            // If user goes on /auth/ redirect him to main page
            res.redirect('../');
        })
        // passport discord
        // calling discord strategy as middleware
        this.get('/discord', passport.authenticate('discord'));
        this.get('/redirect', passport.authenticate('discord'), (req, res, next)=> {
            if (req.error) res.status(500).json({
                error: req.error
            })
            res
                .status(200)
                .json({
                    user: req.user,
                    token: "Bearer " + jwt.sign(
                        {userID: req.user.userID},
                        process.env.WEBTOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                })
        });

        // passport jsonwebtoken (only for tests) always use
        this.get('/jwt', passport.authenticate('jwt', {session: false}), (req, res) => {
            res.status(200).send("GG")
        })

        // user logout route,
        // destroy session then redirect user to home
        this.get('/logout', async (req, res) => {
            if (req.user) {
                req.logout();
                req.session.destroy;
                res.redirect('../');
            } else {
                res.redirect('../');
            }
        });
    }
};

module.exports.name = '/auth';