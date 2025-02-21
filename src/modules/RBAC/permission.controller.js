const { RoleModel } = require("./roles.model");
const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { RbacMsg } = require("./rbac.msg");
const { PermissionModel } = require("./permission.model");

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
    async createPermission(req, res, next){
        try {
            const {resource, action, scope} = req.body;
            const actionsArray = Array.isArray(action) ? action : action.split(',').map(a => a.trim());
            const newPermission = new PermissionModel({
                resource,
                action: actionsArray,
                scope
            })
            await newPermission.save()
            return sendResponse(res, StatusCodes.CREATED, RbacMsg.PermissionCreated, {newPermission})
        } catch (error) {
            next(error)
        }
    }
    
    async assignPermissionsToRole(req, res, next){
        try {
            const {roleId} = req.params;
            const {permissions} = req.body;

            // Step 1: Validate the permissions - make sure they exist in the Permission model
            const validPermissions = await PermissionModel.find({_id: {$in: permissions}})
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

    
    // assigning specific permissions directly to a user, bypassing role-based permissions
    async grantDirectPermissions(req, res, next){
        try {
            const {error} = GrantPermissionSchema.validate(req.body)
            if(error) throw new httpError(error.message)
            const {userId, permissions} = req.body;
            const user = await UserModel.findByIdAndUpdate(userId, {
                $addToSet: {directPermissions: permissions}
            })
            if(!user) throw new httpError.BadRequest(RbacMsg.UserNFound)
            
            
            return sendResponse(res, StatusCodes.OK, 'Role permissions updated successfully')
        } catch (error) {
            next(error)
        }
    }

   
}

module.exports = {
    PermissionController: new PermissionController()
}