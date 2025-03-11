const { RoleModel } = require("./roles.model");
const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { RbacMsg } = require("./rbac.msg");
const { PermissionModel } = require("./permission.model");
const { UserModel } = require("../user/user.model");
const APP_RESOURCES = require("../../common/constants/resources");

class PermissionController{

    // ROLE MANAGEMENT

    async createPermission(req, res, next) {
        try {
            const { resource, actions, description } = req.body;
            if(!Object.values(APP_RESOURCES).includes(resource)){
                return sendResponse(res, StatusCodes.BAD_REQUEST, RbacMsg.InvalidResource, null)
            }
    
            // Create new permission document
            const newPermission = new PermissionModel({
                resource,
                actions,
                description
            });
            
            await newPermission.save();
            return sendResponse(res, StatusCodes.CREATED, RbacMsg.PermissionCreated, { permission: newPermission });
        } catch (error) {
            next(error);
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

    async getPermissionById(req, res, next){
        try {
            const {permissionId} = req.params;
            const permission = await PermissionModel.findById(permissionId)
            if(!permission) throw new httpError.NotFound(RbacMsg.PermissionNFound)
            return sendResponse(res, StatusCodes.OK, null, {permission})
        } catch (error) {
            next(error)
        }
    }

    async updatePermission(req, res, next){
        const {resource, scope} = req.body;
        const {permissionId} = req.params;

        if(resource && !Object.values(APP_RESOURCES).includes(resource)){
            return sendResponse(res, StatusCodes.BAD_REQUEST, RbacMsg.InvalidResource, null)
        }
        const permission = await PermissionModel.findByIdAndUpdate(permissionId, {
            resource,
            scope
        }, {new: true})

        if(!permission) throw new httpError.NotFound(RbacMsg.PermissionNFound)
        return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionUpdated, {permission})
    } 

    async deletePermission(req, res, next){
        try {
            const {permissionId} = req.params;

            const permission = await PermissionModel.findById(permissionId)
            if(!permission) throw new httpError.NotFound(RbacMsg.PermissionNFound)
            
            await Promise.all([
                RoleModel.updateMany(
                    {permissions: permissionId},
                    { $pull: {permissions: permissionId}}
                ),
                UserModel.updateMany(
                    {directPermissions: permissionId},
                    {$pull: {directPermissions: permissionId}}
                )
            ])

            const deletedPermission = await PermissionModel.findByIdAndDelete(permissionId)
            if(!deletedPermission) throw new httpError.NotFound(RbacMsg.PermissionAlreadyDeleted)
            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionDeleted)
        } catch (error) {
            next(error)
        }
    }

    async addPermissionsToRole(req, res, next){
        try {
            const {permissionIds} = req.body;
            const {roleId} = req.params;
            const validPermissions = await PermissionModel.countDocuments({_id: {$in: permissionIds}})
            if(permissionIds.length !== validPermissions){
                return sendResponse(res, StatusCodes.BAD_REQUEST, RbacMsg.InvalidPermission)
            }
            const role = await RoleModel.findByIdAndUpdate(roleId, {
                $addToSet: {permissions: {$each: permissionIds}}
            }, {new: true}).populate('permissions');

            if(!role) throw new httpError.NotFound(RbacMsg.RoleNFound)

            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionAssigned, {role})
        } catch (error) {
            next(error)
        }
    }
    
    // assigning specific permissions directly to a user, bypassing role-based permissions
    async grantDirectPermissions(req, res, next){
        try {
           
            const {userId, permissionId} = req.body;
            const permission = await PermissionModel.findById(permissionId);
            if(!permission) throw new httpError.NotFound(RbacMsg.PermissionNFound)

            const user = await UserModel.findById(userId)
            if(!user) throw new httpError.BadRequest(RbacMsg.UserNFound)
            
            if(user.directPermissions.some(p => p.equals(permissionId))){
                throw new httpError.Conflict(RbacMsg.PermissionAlreadyGranted)
            }

            const updateUser = await UserModel.findByIdAndUpdate(userId,
                {$addToSet: {directPermissions: permissionId}},
                {new: true}
            ).select('directPermissions roles')
            
            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionGranted)
        } catch (error) {
            next(error)
        }
    }
    async revokeDirectPermissions(req, res, next){
        try {
           
            const {userId, permissionId} = req.body;

            const updateUser = await UserModel.findByIdAndUpdate(userId,
                {$pull: {directPermissions: permissionId}},
                {new: true}
            ).select('directPermissions roles')
            if(!updateUser) throw new httpError.NotFound(RbacMsg.UserNFound)
            
            return sendResponse(res, StatusCodes.OK, RbacMsg.PermissionGranted, null)
        } catch (error) {
            next(error)
        }
    }

    

   
}

module.exports = {
    PermissionController: new PermissionController()
}