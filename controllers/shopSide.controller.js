const buy = (req, res) => {
    const userID = req.body.userID;
    const itemID = req.body.itemID;

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