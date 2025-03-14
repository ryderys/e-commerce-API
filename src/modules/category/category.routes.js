const {Router} = require("express")
const { CategoryController } = require("./category.controller")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const Authentication = require("../../common/guard/authentication")
const APP_RESOURCES = require("../../common/constants/resources")

const CategoryRoutes = Router()

CategoryRoutes.post("/add", adminAuthMiddleware, checkPermissions(APP_RESOURCES.CATEGORY, 'create') ,CategoryController.createCategory)

CategoryRoutes.get("/all",CategoryController.getAllCategories)

CategoryRoutes.delete("/remove/:id", adminAuthMiddleware, checkPermissions(APP_RESOURCES.CATEGORY, 'deleteOwn'), CategoryController.deleteCategoryById)

module.exports = {
    CategoryRoutes
}