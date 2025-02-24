const Authentication = require("../../common/guard/authentication")
const { WalletController } = require("./wallet.controller")

const WalletRoutes = require("express").Router()

WalletRoutes.get('/', Authentication,WalletController.getBalance)

WalletRoutes.post('/deposit', Authentication, WalletController.addFunds)
WalletRoutes.post('/withdrawal', Authentication, WalletController.withdrawFunds)

module.exports = {
    WalletRoutes
}