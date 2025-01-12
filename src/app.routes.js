const { AuthRoutes } = require("./modules/auth/auth.routes");
const { CategoryRoutes } = require("./modules/category/category.routes");
const { ProductRoutes } = require("./modules/products/product.routes");

const mainRouter = require("express").Router();

mainRouter.use("/auth", AuthRoutes)
mainRouter.use("/product", ProductRoutes)
mainRouter.use("/category", CategoryRoutes)

module.exports = {
    mainRouter
}