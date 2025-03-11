const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const { UserController } = require("./user.controller")

const UserRoutes = require("express").Router()

UserRoutes.get("/me", Authentication, checkPermissions (APP_RESOURCES.User, 'readOwn'),UserController.getProfile)
UserRoutes.get("/all",Authentication,checkPermissions (APP_RESOURCES.User, 'read'), UserController.getAllUsers) //admin access

UserRoutes.patch('/me', Authentication, checkPermissions (APP_RESOURCES.User, 'updateOwn'),UserController.updateUserProfile)


module.exports = {
    UserRoutes
}