const { Router } = require("express");
const { CartController } = require("./cart.controller");
const Authentication = require("../../common/guard/authentication");
const { checkPermissions } = require("../../common/middlewares/authz");
const APP_RESOURCES = require("../../common/constants/resources");

const CartRoutes = Router()

CartRoutes.post("/add-item", Authentication, checkPermissions(APP_RESOURCES.CART, 'create'), CartController.addItemToCart)
CartRoutes.get("/", Authentication, checkPermissions(APP_RESOURCES.CART, 'readOwn'), CartController.getCart)
CartRoutes.get("/clear-cart", Authentication, checkPermissions(APP_RESOURCES.CART, 'readOwn'), CartController.clearCart)

CartRoutes.delete("/remove-item/:productId", Authentication, checkPermissions(APP_RESOURCES.CART, 'deleteOwn'), CartController.removeItemFromCart)

module.exports = {
    CartRoutes
}