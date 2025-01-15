const { Router } = require("express");
const { CartController } = require("./cart.controller");

const CartRoutes = Router()

CartRoutes.post("/add", CartController.addItemToCart)

CartRoutes.delete("/remove/:productId", CartController.removeItemFromCart)

module.exports = {
    CartRoutes
}