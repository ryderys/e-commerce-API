const {Router} = require("express")
const { CategoryController } = require("./category.controller")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const Authentication = require("../../common/guard/authentication")

const CategoryRoutes = Router()

CategoryRoutes.post("/add", Authentication, checkPermissions('category', 'create') ,CategoryController.createCategory)

CategoryRoutes.get("/all",Authentication , checkPermissions('category', 'read'),CategoryController.getAllCategories)

CategoryRoutes.delete("/remove/:id", adminAuthMiddleware, checkPermissions('category', 'delete'), CategoryController.deleteCategoryById)

module.exports = {
    CategoryRoutes
}