const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const { TransactionController } = require("./transaction.controller")

const TransactionRoutes = require("express").Router()

TransactionRoutes.get("/history", Authentication, checkPermissions (APP_RESOURCES.SavedItems, 'readOwn'), TransactionController.getTransactionHistoryByUserId)
TransactionRoutes.get("/history/:transactionId", adminAuthMiddleware, checkPermissions (APP_RESOURCES.SavedItems, 'read'),TransactionController.getTransactionHistoryById)

module.exports = {
    TransactionRoutes
}