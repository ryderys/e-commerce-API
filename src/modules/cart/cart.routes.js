const { Router } = require("express");
const { CartController } = require("./cart.controller");
const Authentication = require("../../common/guard/authentication");

const CartRoutes = Router()

CartRoutes.post("/add-item",Authentication, CartController.addItemToCart)
CartRoutes.get("/",Authentication, CartController.getCart)
CartRoutes.get("/clear-cart",Authentication, CartController.clearCart)

CartRoutes.delete("/remove-item/:productId",Authentication, CartController.removeItemFromCart)

module.exports = {
    CartRoutes
}