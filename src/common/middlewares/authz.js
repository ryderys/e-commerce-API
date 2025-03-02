const createHttpError = require("http-errors");
const { UserModel } = require("../../modules/user/user.model");
const Permissions = require("../../modules/RBAC/premissions");
const Roles = require("../../modules/RBAC/roles");
const { ReviewModel } = require("../../modules/reviews/reviews.model");
const { ProductModel } = require("../../modules/products/product.model");
const { CategoryModel } = require("../../modules/category/category.model");
const { FeaturesModel } = require("../../modules/features/features.model");
const { OrderModel } = require("../../modules/order/order.model");
const { CartModel } = require("../../modules/cart/cart.model");
const { SavedItemsModel } = require("../../modules/savedItems/savedItem.model");
const { RoleModel } = require("../../modules/RBAC/roles.model");
const { getPermissionsByIds } = require("../utils/helperFunctions");
const { ReportModel } = require("../../modules/reports/reports.model");
const { TransactionModel } = require("../../modules/transaction/transaction.model");
const { WalletModel } = require("../../modules/wallet/wallet.model");
const { PermissionModel } = require("../../modules/RBAC/permission.model");


// const checkPermissions = (resource, action) => {
//     return async (req, res, next) => {
//         try {
//             const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];  // Handling single or multiple roles
//             if (!userRoles.length) {
//                 throw new createHttpError.BadRequest("No roles found");
//             }
            
//             let hasPermission = false;
//             const visitedRoles = new Set();

//             const permissions  = await getPermissionsByIds(req.user?.directPermissions)
            
//             if(permissions.some(permission => permission.resource === resource && permission.action.includes(action))){
//                 hasPermission = true
//                 return next()
//             }

//             if(!hasPermission){
//                 // Check each role in the user's roles
//             for (const role of userRoles) {
//                 let currentRole = role;
//                 let roleLevel = 0; // To limit depth in case of circular inheritance

//                 // Prevent circular role inheritance
//                 while (currentRole && roleLevel < 10) { // Avoid infinite loops by limiting depth
//                     if (visitedRoles.has(currentRole)) {
//                         break;  // Prevent circular role inheritance
//                     }
//                     visitedRoles.add(currentRole);
//                     roleLevel++;

//                     const roleData = await RoleModel.findById(currentRole).populate('permissions'); //fetch role from DB
//                     if (!roleData) throw new createHttpError.BadRequest('Invalid role');

//                     // Filter permissions based on resource, action, and scope
//                     const rolePermissions = roleData.permissions.filter(p =>
//                         p.resource === resource &&
//                         p.action.includes(action) &&
//                         (p.scope === 'global' || p.scope === 'own') // Only global and own scope are allowed
//                     );

//                     if (rolePermissions.length > 0) {
//                         hasPermission = true;
//                         const permission = rolePermissions[0];

//                         // Handle 'own' scope (only for modifying existing resources)
//                         if (permission.scope === 'own') {
//                             const resourceId = req.params.id || req.body.id;
//                             if (!resourceId) {
//                                 throw new createHttpError.BadRequest('Resource ID required for modifying resource ownership');
//                             }
//                             const resourceDoc = await getResourceDocument(resource, resourceId);

//                             if (resourceDoc && resourceDoc.userId.toString() !== req.user._id.toString()) {
//                                 throw new createHttpError.Forbidden('You can only modify your own resource');
//                             }
//                         }
//                         break;  // Break if permission is found
//                     }

//                     // Check for inherited roles if no permission found
//                     currentRole = roleData.inherits.length > 0 ? roleData.inherits[0] : null;  // Check the first inherited role
//                 }

//                 if (hasPermission) break;  // Break the loop if permission is found
//             }
//             }

//             // If the user has the permission, continue to the next middleware
//             if (hasPermission) {
//                 return next();  // Allow access if permission is found
//             } else {
//                 throw new createHttpError.Forbidden('Insufficient permissions');
//             }

//         } catch (error) {
//             next(error);  // Pass errors to the error handler
//         }
//     };
// };

// const checkPermissions = (resource, action) => {
//     return async (req, res, next) => {
//         try {
//             const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];  // Handling single or multiple roles
//             if (!userRoles.length) {
//                 throw new createHttpError.BadRequest("No roles found");
//             }

//             const resourcePermissions = Permissions[resource];
//             if (!resourcePermissions || !resourcePermissions.actions.includes(action)) {
//                 throw new createHttpError.NotFound(`Permission not found for resource: ${resource}, action: ${action}`);
//             }

//             let hasPermission = false;
//             const visitedRoles = new Set();

//             // Check each role in the user's roles
//             for (const role of userRoles) {
//                 let currentRole = role;
//                 while (currentRole) {
//                     if (visitedRoles.has(currentRole)) {
//                         break;  // Prevent circular role inheritance
//                     }
//                     visitedRoles.add(currentRole);
                    
//                     const roleData = await RoleModel.findById(currentRole) //fetch role from DB
//                     if(!roleData) throw new createHttpError.BadRequest('invalid role')

//                     if (resourcePermissions.actions.includes(action)) {
//                         hasPermission = true;
//                         break;
//                     }

//                     currentRole = roleData.inherits[0];  // Get inherited role
//                 }

//                 if (hasPermission) break;  // Break the loop if permission is found
//             }

//             // Check if it's an "own" action (updateOwn, deleteOwn) and if the user is trying to modify their own resource
//             if (action.endsWith('Own')) {
//                 const resourceId = req.params.id || req.body.id;  // Assuming resource ID comes from the params or body
//                 const resourceDoc = await getResourceDocument(resource, resourceId);  // Fetch the resource (review, order, etc.)
                
//                 // Check if the user is the owner of the resource
//                 if (resourceDoc && resourceDoc.userId.toString() !== req.user._id.toString()) {
//                     throw new createHttpError.Forbidden('You can only modify your own resource');
//                 }
//             }

//             if (hasPermission) {
//                 next();  // Allow access if permission is found
//             } else {
//                 throw new createHttpError.Forbidden('Insufficient permissions');
//             }

//         } catch (error) {
//             next(error);
//         }
//     };
// };

const checkPermissions = (resource, action) => {
    return async (req, res, next) => {
        try {
            // Get all permissions (direct + role-based)
            const permissions = [
                ...(await getDirectPermissions(req.user)),
                ...(await getRolePermissions(req.user.roles))
            ];

            // Find matching permission
            const hasAccess = permissions.some(permission => {
                if (permission.resource !== resource) return false;
                
                const operation = permission.operations.find(op => 
                    op.action === action && 
                    checkScope(op.scope, req, resource)
                );
                
                return !!operation;
            });

            if (!hasAccess) throw new createHttpError.Forbidden(`Insufficient permissions for ${action} on ${resource}`);
            next();
        } catch (error) {
            next(error);
        }
    };
};

async function checkScope(scope, req, resource) {
    if (scope === 'global') return true;
    
    // Handle 'own' scope
    if (scope === 'own') {
        const resourceId = req.params.id || req.body.id;
        if(!resourceId) throw new createHttpError.BadRequest(`Resource ID required for ${resource} operation`)

        const resourceDoc = await getResourceDocument(resource, resourceId);
        if (!resourceDoc) throw new createHttpError.NotFound(`${resource} not found`);

        const ownerId = resourceDoc.owner || resourceDoc.userId;
        if(!ownerId) throw new createHttpError.NotFound(`No ownership data found for ${resource}`)
        return ownerId.toString() === req.user._id.toString()
    }

    throw new createHttpError.BadRequest(`Invalid scope for ${resource} operation`)
}

const getDirectPermissions = async (user) => {
    return PermissionModel.find({
        _id: { $in: user.directPermissions }
    });
}

const getRolePermissions = async (roleIds) => {
    if (!roleIds || roleIds.length === 0) return [];
    const roles = await RoleModel.find({ _id: { $in: roleIds } })
        .populate('permissions')
        .populate({
            path: 'inherits',
            populate: { path: 'permissions' }
        });
        return roles.flatMap(role => 
            role.permissions?.concat(
                role.inherits?.flatMap(inherited => inherited.permissions) || []
            ) || []
        );
}


const getResourceDocument = async(resource, id) => {
    
    const models = {
        review: ReviewModel,
        product: ProductModel,
        category: CategoryModel,
        features: FeaturesModel,
        order: OrderModel,
        cart: CartModel,
        savedItems: SavedItemsModel,
        user: UserModel,
        report: ReportModel,
        transaction: TransactionModel,
        wallet: WalletModel

    }
    const Model = models[resource.toLowerCase()]
    if(!Model) throw new createHttpError.BadRequest(`Unknown resource type: ${resource}. Valid resources are: ${Object.keys(models).join(', ')}`)

    return Model.findById(id).select('owner userId').lean()
}


module.exports = {
    checkPermissions,
}
