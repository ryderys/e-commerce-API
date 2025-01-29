const Authentication = require("../../common/guard/authentication")
const { SavedItemsController } = require("./savedItems.controller")

const SavedItemRoutes = require("express").Router()

SavedItemRoutes.post("/save-item", Authentication, SavedItemsController.saveItemToBookmarks)
SavedItemRoutes.post("/add-to-cart", Authentication, SavedItemsController.addSavedItemToCart)
SavedItemRoutes.get("/", Authentication, SavedItemsController.getSavedItems)

SavedItemRoutes.delete("/remove-item/:productId", Authentication, SavedItemsController.removeSavedItem)



module.exports = {
    SavedItemRoutes
}