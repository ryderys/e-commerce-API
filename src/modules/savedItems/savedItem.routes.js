const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const { checkPermissions } = require("../../common/middlewares/authz")
const { SavedItemsController } = require("./savedItems.controller")

const SavedItemRoutes = require("express").Router()

SavedItemRoutes.post("/save-item",Authentication, checkPermissions(APP_RESOURCES.SavedItems, 'create') ,SavedItemsController.saveItemToBookmarks)
SavedItemRoutes.post("/add-to-cart", Authentication, checkPermissions(APP_RESOURCES.SavedItems, 'updateOwn'), SavedItemsController.addSavedItemToCart)
SavedItemRoutes.get("/", Authentication, checkPermissions(APP_RESOURCES.SavedItems, 'readOwn'), SavedItemsController.getSavedItems)

SavedItemRoutes.delete("/remove-item/:productId", Authentication, checkPermissions (APP_RESOURCES.SavedItems, 'deleteOwn'),SavedItemsController.removeSavedItem)



module.exports = {
    SavedItemRoutes
}