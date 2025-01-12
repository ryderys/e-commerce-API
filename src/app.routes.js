const { AuthRoutes } = require("./modules/auth/auth.routes");
const { ProductRoutes } = require("./modules/products/product.routes");

const mainRouter = require("express").Router();

mainRouter.use("/auth", AuthRoutes)
mainRouter.use("/product", ProductRoutes)

module.exports = {
    mainRouter
}