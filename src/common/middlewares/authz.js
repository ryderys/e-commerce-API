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





const checkPermissions = (resource, action) => {
    return async (req, res, next) => {
        try {
            const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];  // Handling single or multiple roles
            if (!userRoles.length) {
                throw new createHttpError.BadRequest("No roles found");
            }

            const resourcePermissions = Permissions[resource]?.[action];
            if (!resourcePermissions) {
                throw new createHttpError.NotFound(`Permission not found for resource: ${resource}, action: ${action}`);
            }

            let hasPermission = false;
            const visitedRoles = new Set();

            // Check each role in the user's roles
            for (const role of userRoles) {
                let currentRole = role;
                while (currentRole) {
                    if (visitedRoles.has(currentRole)) {
                        break;  // Prevent circular role inheritance
                    }
                    visitedRoles.add(currentRole);

                    if (resourcePermissions.includes(currentRole)) {
                        hasPermission = true;
                        break;
                    }

                    currentRole = Roles[currentRole]?.[0];  // Move to the inherited role
                }

                if (hasPermission) break;  // Break the loop if permission is found
            }

            // Check if it's an "own" action (updateOwn, deleteOwn) and if the user is trying to modify their own resource
            if (action.endsWith('Own')) {
                const resourceId = req.params.id || req.body.id;  // Assuming resource ID comes from the params or body
                const resourceDoc = await getResourceDocument(resource, resourceId);  // Fetch the resource (review, order, etc.)
                
                // Check if the user is the owner of the resource
                if (resourceDoc && resourceDoc.userId.toString() !== req.user._id.toString()) {
                    throw new createHttpError.Forbidden('You can only modify your own resource');
                }
            }

            if (hasPermission) {
                next();  // Allow access if permission is found
            } else {
                throw new createHttpError.Forbidden('Insufficient permissions');
            }

        } catch (error) {
            next(error);
        }
    };
};

const getResourceDocument = async(resource, id) => {
    switch (resource){
        case 'review':
            return ReviewModel.findById(id)
        case 'product':
            return ProductModel.findById(id)
        case 'category':
            return CategoryModel.findById(id)
        case 'features':
            return FeaturesModel.findById(id)
        case 'order':
            return OrderModel.findById(id)
        case 'cart':
            return CartModel.findById(id)
        case 'savedItems':
            return SavedItemsModel.findById(id)
        case 'user':
            return UserModel.findById(id)
    }
}


module.exports = {
    checkPermissions,
}
