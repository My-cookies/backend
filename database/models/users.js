const Sequelize = require('sequelize');
const db_conenct = require('../../database/DB_connection');
const {v4: uuidv4} = require("uuid");

const Users = db_conenct.define('users', {
        userID: {
            type: Sequelize.STRING(25),
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING(255),
        },
        money: {
            type: Sequelize.BIGINT,
            allowNull: false,
            default: 0
        }
    },
    {
        timestamps: false
    });

module.exports = Users