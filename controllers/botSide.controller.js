const Sequelize = require("sequelize");

const getTop = (req, res) => {
    req.db.models.users.findAll({
        limit: 10,
        order: [Sequelize.col('MONEY')],
    })
        .then((top) => {
            return res
                .status(200)
                .json({top: top})
        })
        .catch(e => {
            console.log(e)
            return res.status(500).json({message: "error"})
        })
}

const seeUserMoney = (req, res) => {
    const userID = req.params.user;
    req.db.models.users.findOrCreate({
        where: {
            userID: userID
        }
    })
        .then(u => {
            res.status(200).json({
                message: "success",
                money: u[0].money
            })
        })
        .catch(e => {
            console.log(e)
            return res.status(500).json({message: "error"})
        })
}

const userMoneyAdd = (req, res) => {
    const userID = req.params.user;
    let user = req.db.models.users.findOrCreate({
        where: {
            userID: userID
        }
    })
        .then(async u => {
            if (u[0]) {
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
        .catch(e => {
            console.log(e)
            res.status(500).json({message: "error"})
        })
}

const userMoneyRemove = (req, res) => {
    const userID = req.params.user;
    let user = req.db.models.users.findOrCreate({
        where: {
            userID: userID
        }
    })
        .then(async u => {
            if (u[0]) {
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
        .catch(e => {
            console.log(e)
            res.status(500).json({message: "error"})
        })
}

const userDonate = async (req, res) => {
    const userID1 = req.body.user1
    const userID2 = req.body.user2
    const amount = req.body.amount
    let giver = await req.db.models.users.findOne({
        where: {
            userID: userID1
        }
    })
    if (giver.money >= amount) {
        let receiver = await req.db.models.users.findOne({
            where: {
                userID: userID2
            }
        })
        giver.money -= parseInt(amount)
        receiver.money += parseInt(amount)
        await giver.save()
        await receiver.save()
        res.status(200).json({
            message: "Donate success"
        })
    }
    else {
        res.status(409).json({
            message: "Error - Giver user hasn't enough money"
        })
    }
}

module.exports = {
    getTop,
    seeUserMoney,
    userMoneyAdd,
    userMoneyRemove,
    userDonate
}
