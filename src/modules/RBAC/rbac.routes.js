const { PermissionController } = require("./permission.controller")
const { RoleController } = require("./role.controller")


const RbacRoutes = require("express").Router()

RbacRoutes.post("/roles/create", RoleController.createRole)

RbacRoutes.get("/roles", RoleController.getAllRoles)

RbacRoutes.get("/roles/:roleId", RoleController.getRoleById)

RbacRoutes.delete("/roles/:roleId", RoleController.deleteRole)

RbacRoutes.get("/roles/users/:roleId", RoleController.getUsersWithRole)

RbacRoutes.post("/roles/:roleId/assign/:userId", RoleController.assignRoleToUser)
RbacRoutes.post("/roles/:roleId/revoke/:userId", RoleController.revokeRoleFromUser)

// RbacRoutes.put("/roles/inheritance/:roleId", RoleController.addInheritedRole)

// RbacRoutes.get("/roles/permissions/:roleId", RoleController.getRolePermission)

// PERMISSIONS

RbacRoutes.post("/permissions/create", PermissionController.createPermission)

RbacRoutes.get("/permissions", PermissionController.getAllPermissions)

RbacRoutes.get("/permissions/:permissionId", PermissionController.getPermissionById)

RbacRoutes.patch("/permissions/:permissionId", PermissionController.updatePermission)

RbacRoutes.delete("/permissions/:permissionId", PermissionController.deletePermission)


// RbacRoutes.put("/permissions/assign/:roleId", PermissionController.assignPermissionsToRole)



// RbacRoutes.put("/permissions/:roleId", PermissionController.updateRolePermissions)


RbacRoutes.post("/grant-direct-permission", PermissionController.grantDirectPermissions)
RbacRoutes.post("/revoke-direct-permission", PermissionController.revokeDirectPermissions)





module.exports = {
    RbacRoutes
}