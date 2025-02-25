const Authentication = require("../../common/guard/authentication")
const { TransactionController } = require("./transaction.controller")

const TransactionRoutes = require("express").Router()

TransactionRoutes.get("/history", Authentication, TransactionController.getTransactionHistoryByUserId)
TransactionRoutes.get("/history/:transactionId", Authentication, TransactionController.getTransactionHistoryById)

module.exports = {
    TransactionRoutes
}