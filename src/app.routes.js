const { AuthRoutes } = require("./modules/auth/auth.routes");
const { CartRoutes } = require("./modules/cart/cart.routes");
const { CategoryRoutes } = require("./modules/category/category.routes");
const { FeatureRoutes } = require("./modules/features/features.routes");
const { ProductRoutes } = require("./modules/products/product.routes");

const mainRouter = require("express").Router();

mainRouter.use("/auth", AuthRoutes)
mainRouter.use("/product", ProductRoutes)
mainRouter.use("/category", CategoryRoutes)
mainRouter.use("/feature", FeatureRoutes)
mainRouter.use("/cart", CartRoutes)

module.exports = {
    mainRouter
}