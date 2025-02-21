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


const checkPermissions = (resource, action) => {
    return async (req, res, next) => {
        try {
            const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];  // Handling single or multiple roles
            if (!userRoles.length) {
                throw new createHttpError.BadRequest("No roles found");
            }

            let hasPermission = false;
            const visitedRoles = new Set();

            // Check each role in the user's roles
            for (const role of userRoles) {
                let currentRole = role;
                let roleLevel = 0; // To limit depth in case of circular inheritance

                // Prevent circular role inheritance
                while (currentRole && roleLevel < 10) { // Avoid infinite loops by limiting depth
                    if (visitedRoles.has(currentRole)) {
                        break;  // Prevent circular role inheritance
                    }
                    visitedRoles.add(currentRole);
                    roleLevel++;

                    const roleData = await RoleModel.findById(currentRole).populate('permissions'); //fetch role from DB
                    if (!roleData) throw new createHttpError.BadRequest('Invalid role');

                    // Filter permissions based on resource, action, and scope
                    const rolePermissions = roleData.permissions.filter(p =>
                        p.resource === resource &&
                        p.action.includes(action) &&
                        (p.scope === 'global' || p.scope === 'own') // Only global and own scope are allowed
                    );

                    if (rolePermissions.length > 0) {
                        hasPermission = true;
                        const permission = rolePermissions[0];

                        // Handle 'own' scope (only for modifying existing resources)
                        if (permission.scope === 'own') {
                            const resourceId = req.params.id || req.body.id;
                            if (!resourceId) {
                                throw new createHttpError.BadRequest('Resource ID required for modifying resource ownership');
                            }
                            const resourceDoc = await getResourceDocument(resource, resourceId);

                            if (resourceDoc && resourceDoc.userId.toString() !== req.user._id.toString()) {
                                throw new createHttpError.Forbidden('You can only modify your own resource');
                            }
                        }
                        break;  // Break if permission is found
                    }

                    // Check for inherited roles if no permission found
                    currentRole = roleData.inherits.length > 0 ? roleData.inherits[0] : null;  // Check the first inherited role
                }

                if (hasPermission) break;  // Break the loop if permission is found
            }

            // If the user has the permission, continue to the next middleware
            if (hasPermission) {
                return next();  // Allow access if permission is found
            } else {
                throw new createHttpError.Forbidden('Insufficient permissions');
            }

        } catch (error) {
            next(error);  // Pass errors to the error handler
        }
    };
};

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

const getResourceDocument = async(resource, id) => {
    
    const models = {
        review: ReviewModel,
        product: ProductModel,
        category: CategoryModel,
        features: FeaturesModel,
        order: OrderModel,
        cart: CartModel,
        savedItems: SavedItemsModel,
        user: UserModel
    }
    const Model = models[resource.toLowerCase()]
    if(!Model) throw new createHttpError.BadRequest(`Unknown resource: ${resource}`)

    return Model.findById(id)
}


module.exports = {
    checkPermissions,
}
