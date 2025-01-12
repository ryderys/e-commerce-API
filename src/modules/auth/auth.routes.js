const {Router} = require("express")
const { UserAuthController } = require("./auth.controller")
const Authentication = require("../../common/guard/authentication")

const AuthRoutes = Router()

AuthRoutes.post("/get-otp", UserAuthController.getOTP)
AuthRoutes.post("/check-otp", UserAuthController.checkOTP)
AuthRoutes.post("/refresh-token", UserAuthController.refreshToken)
AuthRoutes.post("/logout", Authentication, UserAuthController.logout)

module.exports = {
    AuthRoutes
}