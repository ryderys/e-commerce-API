const Authentication = require("../../common/guard/authentication")
const { UserController } = require("./user.controller")

const UserRoutes = require("express").Router()

UserRoutes.get("/me", Authentication, UserController.getUserProfile)
UserRoutes.get("/all", Authentication, UserController.getAllUsers) //admin access

UserRoutes.patch('/me', Authentication, UserController.updateUserProfile)


module.exports = {
    UserRoutes
}