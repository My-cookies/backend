const Sequelize = require('sequelize');
const db_conenct = require('../../database/DB_connection');
const {v4: uuidv4} = require("uuid");
const Item_list = require('./item_list');
const Users = require('./users');

const User_item = db_conenct.define('user_items', {
        userID: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },
        itemID: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },
    },
    {
        timestamps: false
    });

Users.hasMany(User_item, {foreignKey: 'userID', sourceKey: 'userID'})
Item_list.hasMany(User_item, {foreignKey: 'itemID', sourceKey: 'itemID'})

User_item.belongsTo(Users, {foreignKey: 'userID', targetKey: 'userID'});
User_item.belongsTo(Item_list, {foreignKey: 'itemID', targetKey: 'itemID'});

// db_conenct.models.item_list.findOrCreate({
//     where: {
//         itemID: ,
//         itemName: "Cookie miner",
//         itemDescription: "that's a cookie miner, it gives you free cookies"
//     }
// })

module.exports = User_item