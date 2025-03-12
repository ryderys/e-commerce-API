const { RoleModel } = require("./roles.model");
const { sendResponse } = require("../../common/utils/helperFunctions");
const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { RbacMsg } = require("./rbac.msg");
const { UserModel } = require("../user/user.model");
const { PermissionModel } = require("./permission.model");
const { default: mongoose } = require("mongoose");

class RoleController{

    // ROLE MANAGEMENT
    async createRole(req, res, next){
        try {
            const {name, permissions, inherits, description} = req.body;
            
            const roleExists = await RoleModel.findOne({name})
            if(roleExists) throw new httpError.Conflict(RbacMsg.RoleExists)

            const permissionIds = permissions.split(",")
            const validPermissions = await PermissionModel.countDocuments({_id: {$in: permissionIds}})
            if(permissions.split(",").length !== validPermissions){
                return sendResponse(res, StatusCodes.BAD_REQUEST, RbacMsg.InvalidPermission)
            }
            const newRole = await RoleModel.create({name,permissions: permissionIds, inherits, description})
            return sendResponse(res, StatusCodes.CREATED, RbacMsg.RoleCreated, {role: newRole})
        } catch (error) {
            next(error)
        }
    }

    async getAllRoles(req, res, next){
        try {
            const roles = await RoleModel.find()``
            if(!roles) throw new httpError.NotFound(RbacMsg.RoleNFound)
            return sendResponse(res, StatusCodes.OK, null, {roles})
        } catch (error) {
            next(error)
        }
    }

    async getRoleById(req, res, next){
        try {
            const {roleId} = req.params;

            const role = await RoleModel.findById(roleId).populate('permissions').populate('inherits', 'name')

            if(!role) throw httpError.NotFound(RbacMsg.RoleNFound)

            const effectivePermissions = await role.effectivePermissions;
            return sendResponse(res, StatusCodes.OK, null, {...role.toJSON(), effectivePermissions})
        } catch (error) {
            next(error)
        }
    }

    async deleteRole(req, res, next){
        try {
            const {roleId} = req.params;
            
            const role = await RoleModel.findById(roleId)
            if(!role) throw new httpError.NotFound(RbacMsg.RoleNFound)

            const usersWithRole = await UserModel.find({roles: roleId})
            if(usersWithRole.length > 0){
                await UserModel.updateMany(
                    {roles: roleId},
                    { $pull: {roles: roleId}}
                )
            }

            await RoleModel.updateMany(
                {inherits: role._id},
                {$pull: {inherits: role._id}}
            )
            await RoleModel.findByIdAndDelete(roleId)

            return sendResponse(res, StatusCodes.OK, RbacMsg.RoleDeleted)
        } catch (error) {
            next(error)
        }
    }

    async getUsersWithRole(req, res, next){
        try {
            const {roleId} = req.params
            const users = await UserModel.find({roles: roleId})
            if(!users) throw new httpError.BadRequest(RbacMsg.RoleNFound)
            return sendResponse(res, StatusCodes.OK, null, {users})
        } catch (error) {
            next(error)
        }
    }
    
    async assignRoleToUser(req, res, next){
        try {
            const {userId, roleId} = req.params;

            const role = await RoleModel.findById(roleId);
            if(!role) throw new httpError.NotFound(RbacMsg.RoleNFound);
            const user = await UserModel.findByIdAndUpdate(userId, {
                $addToSet: {roles: roleId}
            }, {new: true}).populate('roles', 'name permissions')

            if(!user) throw new httpError.NotFound(RbacMsg.UserNFound)
            return sendResponse(res, StatusCodes.OK, RbacMsg.RoleAssigned, null)
        } catch (error) {
            next(error)
        }
    }

    async revokeRoleFromUser(req, res, next){
        try {
            const {userId, roleId} = req.params;

            const user = await UserModel.findByIdAndUpdate(userId,
                {$pull: {roles: roleId}},
                {new: true}).populate('roles', 'name permissions')
            if(!user) throw new httpError.NotFound(RbacMsg.UserNFound)

            return sendResponse(res, StatusCodes.OK, RbacMsg.RoleRevoked, null)
        } catch (error) {
            next(error)
        }
    }


    
   
}


module.exports = {
    RoleController: new RoleController()
}