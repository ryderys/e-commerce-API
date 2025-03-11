const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const { OrderController } = require("./order.controller")

const OrderRoutes = require("express").Router()

OrderRoutes.post("/create", Authentication, checkPermissions(APP_RESOURCES.Order, 'create'),OrderController.createOrder)
OrderRoutes.get("/", Authentication, checkPermissions(APP_RESOURCES.Order, 'readOwn'),OrderController.getOrder)

OrderRoutes.get("/:orderId", Authentication, checkPermissions(APP_RESOURCES.Order, 'readOwn'),OrderController.getOrderDetails)
OrderRoutes.patch("/:orderId/cancel", Authentication, checkPermissions(APP_RESOURCES.Order, 'updateOwn'),OrderController.cancelOrder)
OrderRoutes.patch("/:orderId/status", adminAuthMiddleware, checkPermissions(APP_RESOURCES.Order, 'updateOwn'),OrderController.updateOrderStatus) //admin only

module.exports = {
    OrderRoutes
}