const {Router} = require("express")
const { CategoryController } = require("./category.controller")

const CategoryRoutes = Router()

CategoryRoutes.post("/add", CategoryController.createCategory)

CategoryRoutes.get("/all", CategoryController.getAllCategories)

CategoryRoutes.delete("/remove/:id", CategoryController.deleteCategoryById)

module.exports = {
    CategoryRoutes
}