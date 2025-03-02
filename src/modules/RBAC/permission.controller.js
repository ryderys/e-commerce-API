const { RoleModel } = require("./roles.model");
const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { RbacMsg } = require("./rbac.msg");
const { PermissionModel } = require("./permission.model");
const { UserModel } = require("../user/user.model");

class PermissionController{

    // ROLE MANAGEMENT

    async updateRolePermissions(req, res, next){
        try {
            // const {error} = roleSchema.validate(req.body)
            // if(error){
            //     throw new httpError(error.message)
            // }
            
            const { roleId } = req.params
            const {permissionIds} = req.body;
            
            const updatedRole = await RoleModel.findOneAndUpdate(roleId, 
                { $set: {permissions: permissionIds}},
                { new: true, runValidators: true}
            ).populate('permissions', 'resource action scope')
            if(!updatedRole) throw new httpError.BadRequest(RbacMsg.PermissionNUpdated)
            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionUpdated)
        } catch (error) {
            next(error)
        }
    }
    // PERMISSION MANAGEMENT
    // async createPermission(req, res, next){
    //     try {
    //         const {resource, action, scope} = req.body;
    //         const actionsArray = Array.isArray(action) ? action : action.split(',').map(a => a.trim());
    //         const newPermission = new PermissionModel({
    //             resource,
    //             action: actionsArray,
    //             scope
    //         })
    //         await newPermission.save()
    //         return sendResponse(res, StatusCodes.CREATED, RbacMsg.PermissionCreated, {newPermission})
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    async createPermission(req, res, next) {
        try {
            const { resource, operations } = req.body;
            const operationsArray = JSON.parse(operations)
            console.log(operationsArray)
            // Validate operations format
            console.log(req.body)
            const isValidOperations = Array.isArray(operationsArray) && 
            operationsArray.every(op => op.action);
            
            if (!isValidOperations) {
                throw new httpError.BadRequest('Invalid operations format');
            }
    
            // Check for existing permissions for this resource
            const existingPermission = await PermissionModel.findOne({ resource });
            if (existingPermission) {
                // Merge new operations with existing ones
                const updatedOperations = [...existingPermission.operations, ...operations]
                    .filter((op, index, self) =>
                        self.findIndex(o => 
                            o.action === op.action && 
                            o.scope === op.scope
                        ) === index
                    );
                
                existingPermission.operations = updatedOperations;
                await existingPermission.save();
                return sendResponse(res, StatusCodes.OK, 'Permission updated', { permission: existingPermission });
            }
    
            // Create new permission document
            const newPermission = new PermissionModel({
                resource,
                operations
            });
            
            await newPermission.save();
            return sendResponse(res, StatusCodes.CREATED, RbacMsg.PermissionCreated, { permission: newPermission });
        } catch (error) {
            next(error);
        }
    }

    //  Get permissions from roles with inheritance
        async getRolePermissions(roleIds) {
            const roles = await RoleModel.find({ _id: { $in: roleIds } })
                .populate({
                    path: 'permissions',
                    populate: { path: 'inherits' }
                });

            return roles.flatMap(role => 
                role.permissions.concat(
                    role.inherits.flatMap(inherited => inherited.permissions)
                )
            );
        }
    
    async assignPermissionsToRole(req, res, next){
        try {
            const {roleId} = req.params;
            const {permissions} = req.body;

            const permissionIds = Array.isArray(permissions) ? permissions : permissions.split(',')
            // Step 1: Validate the permissions - make sure they exist in the Permission model
            const validPermissions = await PermissionModel.find({_id: {$in: permissionIds}})
            // const validPermissions = await PermissionModel.find({_id: {$in: permissions}})
            
            // If some permissions don't exist in the database, return an error
            if(!validPermissions){
                throw new httpError.BadRequest(RbacMsg.InvalidPermission)
            }
            // Step 2: Find the role by ID
            const role = await RoleModel.findById(roleId).populate('permissions').populate('inherits')
            if(!role) throw httpError.NotFound(RbacMsg.RoleNFound)

            // Step 3: Check and assign permissions to the role
            // Add the valid permissions (using ObjectIds) to the role
            role.permissions = [...new Set([...role.permissions.map(p => p._id), ...validPermissions.map(p => p._id)])]
            
            // Step 4: Handle role inheritance
            // If the role inherits from other roles, include their permissions as well
            const inheritedPermissions = []
            for (const inheritedRole of role.inherits) {
                const inheritedRoleData = await RoleModel.findById(inheritedRole).populate('permissions')
                inheritedPermissions.push(...inheritedRoleData.permissions)
            }

            // Add inherited permissions to the role (avoiding duplicates)
            role.permissions = [...new Set([...role.permissions, ...inheritedPermissions.map(p => p._id)])]

            // Step 5: Save the updated role
            await role.save()

            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionAssigned, {role})
        } catch (error) {
            next(error)
        }
    }

    async getAllPermissions(req, res, next){
        try {
            const permissions = await PermissionModel.find()
            if(!permissions) throw new httpError.BadRequest(RbacMsg.PermissionNFound)
            return sendResponse(res, StatusCodes.OK, null, {permissions})
        } catch (error) {
            next(error)
        }
    }

    async deletePermission(req, res, next){
        try {
            const {permissionId} = req.params;

            const permission = await PermissionModel.findById(permissionId)
            if(!permission) throw new httpError.NotFound(RbacMsg.PermissionNFound)
            
            const rolesWithPermission = await RoleModel.find({'permissions': permissionId})
            if(rolesWithPermission.length > 0){
                await RoleModel.updateMany(
                    {'permissions': permissionId},
                    { $pull: {permissions: permissionId}}
                )
            }

            const usersWithPermission = await UserModel.find({'directPermissions': permissionId})
            if(usersWithPermission.length > 0){
                await UserModel.updateMany(
                    {'directPermissions': permissionId},
                    {$pull: {'directPermissions': permissionId}}
                )
            }

            await PermissionModel.findByIdAndDelete(permissionId)
            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionDeleted)
        } catch (error) {
            next(error)
        }
    }
    
    // assigning specific permissions directly to a user, bypassing role-based permissions
    async grantDirectPermissions(req, res, next){
        try {
            // const {error} = GrantPermissionSchema.validate(req.body)
            // if(error) throw new httpError(error.message)
            const {userId, permissionIds} = req.body;
            console.log(permissionIds)
            // if (!Array.isArray(permissionIds) || permissionIds.length === 0){
            //     throw new httpError.BadRequest("Permissions must be a non-empty array.")
            // }
            const user = await UserModel.findByIdAndUpdate(userId, {
                $addToSet: {directPermissions: permissionIds}
            }, {new: true})
            if(!user) throw new httpError.BadRequest(RbacMsg.UserNFound)
            
            
            return sendResponse(res, StatusCodes.OK, 'permissions for this user updated successfully')
        } catch (error) {
            next(error)
        }
    }

   
}

module.exports = {
    PermissionController: new PermissionController()
}