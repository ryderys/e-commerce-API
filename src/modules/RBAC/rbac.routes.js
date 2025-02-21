const { PermissionController } = require("./permission.controller")
const { RoleController } = require("./role.controller")


const RbacRoutes = require("express").Router()

RbacRoutes.post("/roles/create", RoleController.createRole)

RbacRoutes.get("/roles", RoleController.getAllRoles)

RbacRoutes.get("/roles/:roleId", RoleController.getRoleDetails)

RbacRoutes.put("/roles/:roleId/assign", RoleController.assignRoleToUser)

RbacRoutes.put("/roles/inheritance/:roleId", RoleController.addInheritedRole)

RbacRoutes.get("/roles/permissions/:roleId", RoleController.getRolePermission)


RbacRoutes.post("/permissions/create", PermissionController.createPermission)

RbacRoutes.put("/permissions/assign/:roleId", PermissionController.assignPermissionsToRole)

RbacRoutes.get("/permissions", PermissionController.getAllPermissions)


RbacRoutes.put("/permission/:roleId", PermissionController.updateRolePermissions)


RbacRoutes.post("/grant-direct-permission", PermissionController.grantDirectPermissions)





module.exports = {
    RbacRoutes
}