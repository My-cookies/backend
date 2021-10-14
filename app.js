const express = require("express"),
    bodyParser = require("body-parser"),
    dotenv = require("dotenv"),
    rateLimit = require("express-rate-limit"),
    {Sequelize} = require('sequelize'),
    sequelize = require('./database/DB_connection'),
    session = require('express-session'),
    MySQLStore = require('express-mysql-session')(session),
    passport = require('passport'),
    { readdir } = require('fs');

// all stuff for passport
const passportGlobal = require('./strategies/passport'),
    discordStrategy = require('./strategies/discord-strategy'),
    jwtStrategy = require('./strategies/jwt-strategy');

class App {
    constructor() {
        this.app = express();
        this.dotenv = dotenv.config();
        this.limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        });
        this.db = sequelize;
    }

    async setup() {
        this.app.set("trust proxy", 1);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(this.limiter)
        // session + cookie
        this.sessionStore = new MySQLStore({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.db,
            clearExpired: true,
            checkExpirationInterval: 900000,
            expiration: 86400000,
            createDatabaseTable: true,
            connectionLimit: 1,
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'session_id',
                    expires: 'expires',
                    data: 'data'
                }
            }
        })
        this.app.use(session({
            secret: 'FUnuE9xCg4msD8vfVjxe4ZFJsuuPZ6fv3mffe6c2Dvny7jLKkhPZ6fv3mffe6c2Dvny7jLKkh',
            cookie: {
                maxAge: 86400000,
                // secure: true
            },
            resave: false,
            saveUninitialized: false,
            name: 'Discord.Oauth2',
            proxy: true,
            store: this.sessionStore
        }));
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Credentials', true);
            req.user = req.session.user;
            req.db = this.db
            next();
        })
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    async loadRoutes(dir = __dirname+"/routes") {
        readdir(dir, (err, files) => {
            if (err) return console.log(err);
            const routes = files.filter((c) => c.split('.').pop() === 'js');
            if (files.length === 0 || routes.length === 0) throw new Error('Aucune route n\'a été trouvée !');
            for (let i = 0; i < routes.length; i++) {
                let route = require(`${dir}/${routes[i]}`);
                this.app.use(route.name, new route.Router());
                console.log("Route loaded : " + route.name)
            }
        });
    }

    async loadModels(){
        const mdlFiles = `${__dirname}/database/models`;
        readdir(mdlFiles, (err, files) => {
            if (err) return console.log(err);
            const models = files.filter((c) => c.split('.').pop() === 'js');
            if (files.length === 0 || models.length === 0) throw new Error('Aucun model n\'a été trouvée !');
            this.db.authenticate().then(async () => {
                for (let i = 0; i < models.length; i++){
                    await require(`${mdlFiles}/${models[i]}`);
                    console.log(`Model loaded -> ${models[i]}`);
                }
                await this.db.sync({
                    alter: true,
                    force: false
                })
            }).catch(async (err) => {
                console.log(err);
            })
        })
    };

}

module.exports = App