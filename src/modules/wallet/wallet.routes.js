const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const { checkPermissions } = require("../../common/middlewares/authz")
const { WalletController } = require("./wallet.controller")

const WalletRoutes = require("express").Router()

WalletRoutes.get('/', Authentication, checkPermissions (APP_RESOURCES.WALLET, 'readOwn'),WalletController.getBalance)

WalletRoutes.post('/deposit', Authentication, checkPermissions (APP_RESOURCES.WALLET, 'updateOwn'), WalletController.addFunds)
WalletRoutes.post('/withdrawal', Authentication, checkPermissions (APP_RESOURCES.WALLET, 'updateOwn'),WalletController.withdrawFunds)

module.exports = {
    WalletRoutes
}