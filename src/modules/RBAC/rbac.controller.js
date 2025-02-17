const { sendResponse } = require("../../common/utils/helperFunctions");
const { UserModel } = require("../user/user.model");
const { StatusCodes } = require("http-status-codes");
const { RoleModel } = require("./roles.model");
const { addRoleSchema } = require("../../common/validations/rbac.validation");
const httpError = require("http-errors");

class RBACController{
    async assignRoleToUser(req, res, next){
        try {
            const {error} = addRoleSchema.validate(req.body)
            if(error){
                throw new httpError(error.message)
            }
            const {userId, roleName} = req.body

            await UserModel.findByIdAndUpdate(userId, {
                $addToSet: {role: roleName}
            })
            return sendResponse(res, StatusCodes.OK, 'Role assigned successfully')
        } catch (error) {
            next(error)
        }
    }

    // async updateRolePermissions(req, res, next){
    //     try {
    //         const {roleId} = req.params
    //         const {permissions} = req.body

    //         await RoleModel.findByIdAndUpdate(roleId, {
    //             $set: {permissions}
    //         })
    //         return sendResponse(res, StatusCodes.OK, 'Role permissions updated successfully')
    //     } catch (error) {
    //         next(error)
    //     }
    // }

   
}