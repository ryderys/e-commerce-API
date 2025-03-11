const RbacMsg = {
    RoleAssigned: "role assigned successfully",
    RoleRevoked: "role revoked successfully",
    RoleNFound: "Role not found",
    RoleDeleted: "Role deleted successfully",
    PermissionNFound: "permissions not found",
    PermissionNUpdated: "Role permissions not updated",
    PermissionUpdated: "Role permissions updated successfully",
    UserNFound: "user not found",
    RoleCreated: "role created successfully",
    RoleExists: 'Role already exists',
    PermissionCreated: "permission created successfully",
    InheritanceAdded: "inheritance added",
    InvalidPermission: "one or more  permissions are invalid.",
    PermissionAssigned: 'Permissions assigned to role successfully',
    PermissionDeleted: 'permission deleted successfully',
    InvalidResource: 'Invalid resource',
    PermissionAlreadyDeleted: "permission was already deleted or not found",
    PermissionAlreadyGranted: "permission already granted",
    PermissionGranted: "'permissions for this user updated successfully'"
}

module.exports = {
    RbacMsg
}