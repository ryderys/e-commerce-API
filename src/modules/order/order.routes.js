const Authentication = require("../../common/guard/authentication")
const { OrderController } = require("./order.controller")

const OrderRoutes = require("express").Router()

OrderRoutes.post("/create", Authentication,OrderController.createOrder)
OrderRoutes.get("/", Authentication,OrderController.getOrder)

OrderRoutes.get("/:orderId", Authentication, OrderController.getOrderDetails)
OrderRoutes.patch("/:orderId/cancel", Authentication, OrderController.cancelOrder)

module.exports = {
    OrderRoutes
}