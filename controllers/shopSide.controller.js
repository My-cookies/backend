const buy = async (req, res) => {
    const userID = req.body.userID;
    const itemID = req.body.itemID;

    let user = await req.db.models.users.findOne({
        where: {
            userID: userID
        }
    })
    let item = await req.db.models.item_list.findOne({
        where: {
            itemID: itemID
        }
    })
    if (!user || !item) {
        return res.status(409).json({
            message: "l'utilisateur ou l'item est introuvable"
        })
    }
    if (item.price > user.money) {
        return res.status(409).json({
            message: "Vous n'avez pas assez d'argent"
        })
    }
    user.money -= item.price
    await user.save()

    req.db.models.user_items.create({
        userID: userID,
        itemID: itemID
    })
        .then(() => {
            return res.status(200).json({
                message: "Item bought with success"
            })
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json({message: "Error while buying the game"})
        })
}

module.exports = { buy }