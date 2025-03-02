const { Router } = require("express");
const { CartController } = require("./cart.controller");
const Authentication = require("../../common/guard/authentication");
const { checkPermissions } = require("../../common/middlewares/authz");

const CartRoutes = Router()

CartRoutes.post("/add-item",Authentication, checkPermissions('cart', 'create'), CartController.addItemToCart)
CartRoutes.get("/",Authentication, checkPermissions('cart', 'readOwn'), CartController.getCart)
CartRoutes.get("/clear-cart",Authentication, CartController.clearCart)

CartRoutes.delete("/remove-item/:productId",Authentication, CartController.removeItemFromCart)

module.exports = {
    CartRoutes
}