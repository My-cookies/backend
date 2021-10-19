const Sequelize = require('sequelize');
const db_conenct = require('../../database/DB_connection');

const Item_list = db_conenct.define('item_list', {
        itemID: {
            type: Sequelize.STRING(25),
            allowNull: false,
            primaryKey: true
        },
        itemName: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },
        itemDescription: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 100
        }
    },
    {
        timestamps: false
    });

module.exports = Item_list