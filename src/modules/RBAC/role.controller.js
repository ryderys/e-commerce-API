const { RoleModel } = require("./roles.model");
const { sendResponse } = require("../../common/utils/helperFunctions");
const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { RbacMsg } = require("./rbac.msg");
const { UserModel } = require("../user/user.model");

class RoleController{

    // ROLE MANAGEMENT
    async createRole(req, res, next){
        try {
            const {role} = req.body;
            const roleExists = await RoleModel.findOne({role})
            if(roleExists) throw new httpError.Conflict(RbacMsg.RoleExists)
            const newRole = new RoleModel({
                role,
            })
            await newRole.save()
            return sendResponse(res, StatusCodes.CREATED, RbacMsg.RoleCreated, {role: newRole})
        } catch (error) {
            next(error)
        }
    }

    async getAllRoles(req, res, next){
        try {
            const roles = await RoleModel.find().select('-__v').populate('permissions', 'resource action scope')
            .populate('inherits', 'role')
            if(!roles) throw new httpError.NotFound(RbacMsg.RoleNFound)
            return sendResponse(res, StatusCodes.OK, null, {roles})
        } catch (error) {
            next(error)
        }
    }
    async getRoleDetails(req, res, next){
        try {
            const {roleId} = req.params
            const role = await RoleModel.findById(roleId).populate({
                path: 'permissions',
                select: 'resource action scope'
            })
            .populate({
                path: 'inherits',
                select: 'role',
                populate: {
                    path: 'permissions',
                    select: 'resource action scope'
                }
            })

            if(!role) throw new httpError.NotFound(RbacMsg.RoleNFound)
            return sendResponse(res, StatusCodes.OK, null, {role})
        } catch (error) {
            next(error)
        }
    }

    async getRolePermission(req, res, next){
        try {
            const {roleId} = req.params;

            const role = await RoleModel.findById(roleId).populate('permissions', 'resource action scope')
            .populate('inherits')

            if(!role) throw httpError.NotFound(RbacMsg.RoleNFound)

            return sendResponse(res, StatusCodes.OK, null, {role})
        } catch (error) {
            next(error)
        }
    }

    async assignRoleToUser(req, res, next){
        try {
            // const {error} = addRoleSchema.validate(req.body)
            // if(error){
            //     throw new httpError(error.message)
            // }
            const {roleId} = req.params
            const {userId} = req.body

            await UserModel.findByIdAndUpdate(userId, 
                {$addToSet: {role: roleId}},
                {new: true}
            )
            return sendResponse(res, StatusCodes.OK, RbacMsg.RoleAssigned)
        } catch (error) {
            next(error)
        }
    }

    async addInheritedRole(req, res, next){
        try {
            const {roleId} = req.params;
            const {inheritedRoleId} = req.body;

            const updatedRole = await RoleModel.findByIdAndUpdate(roleId,
                 {$addToSet: {inherits: inheritedRoleId}},
                 {new: true}
                ).populate('inherits', 'role')

            if(!updatedRole) throw httpError.NotFound(RbacMsg.RoleNFound)
            return sendResponse(res, StatusCodes.OK, RbacMsg.InheritanceAdded, updatedRole)
        } catch (error) {
            next(error)
        }
    }

   
}


module.exports = {
    RoleController: new RoleController()
}