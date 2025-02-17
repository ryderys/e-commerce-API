const createHttpError = require("http-errors");
const { UserModel } = require("../../modules/user/user.model");
const Permissions = require("../../modules/RBAC/premissions");
const Roles = require("../../modules/RBAC/roles");

// const getEffectivePermissions = async (userId) => {
//     const user = await UserModel.findById(userId)
//         .populate({
//             path: 'roles',
//             populate: [
//                 {path: 'permissions'},
//                 {path: 'inherits', populate: {path: 'permissions'}}
//             ]
//         })
//         .populate('directPermissions')

//     const rolePermissions = user.roles.flatMap(role => [
//         ...role.permissions,
//         ...role.inherits.flatMap(inherited => inherited.permissions)
//     ])
//     return [
//         ...new Set([
//             ...rolePermissions.map(p => p.name),
//             ...user.directPermissions.map(p => p.name)
//         ])
//     ]
// };

const checkPermissions = (resource, action) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role;
            if(!userRole){
                throw new createHttpError.BadRequest("no role found")
            }
            const resourcePermissions = Permissions[resource]?.[action];
            if(!resourcePermissions){
                throw new createHttpError.Forbidden('Permission not found for this resource and action.')
            }
            let hasPermission = false;
            let currentRole = userRole;

            while(currentRole){
                if(resourcePermissions.includes(currentRole)){
                    hasPermission = true
                    break
                }
                currentRole = Roles[currentRole]?.[0]
            }
            if(hasPermission){
                next()
            } else {
                throw new createHttpError.Forbidden('Insufficient permissions')
            }

        } catch (error) {
            next(error)
        }
    }
}

const checkOwnership = (model, resource, action) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role;
            const resourcePermissions = Permissions[resource]?.[action]
            if(!resourcePermissions){
                throw new createHttpError.BadRequest('No permission found for this action')
            }

            let hasPermission = false
            let currentRole = userRole

            while(currentRole){
                if(resourcePermissions.includes(currentRole)){
                    hasPermission = true
                    break;
                }
                currentRole = Roles[currentRole]?.[0]
            }
            if(hasPermission){
                next()
            } else if(action.includes('Own')){
                    const resourceId = req.params.id;
                    if(!resourceId) throw new createHttpError.BadRequest('Resource ID missing in request.')
                    const resource = await model.findById(resourceId)
                    if(resource && resource.userId.equals(req.user._id)){
                        next()
                    } else {
                        throw new createHttpError.Forbidden('Forbidden')
                    }
                
            } else {
                throw new createHttpError.Forbidden('forbidden')
            }
        } catch (error) {
            next(error)
        }
    }
} 


module.exports = {
    checkPermissions,
    checkOwnership
}
