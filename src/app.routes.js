const { AuthRoutes } = require("./modules/auth/auth.routes");

const mainRouter = require("express").Router();

mainRouter.use("/auth", AuthRoutes)

module.exports = {
    mainRouter
}