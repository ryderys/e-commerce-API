const createHttpError = require("http-errors");
const { UserModel } = require("../../modules/user/user.model");
const APP_RESOURCES = require("../constants/resources");
const { CartModel } = require("../../modules/cart/cart.model");
const { ProductModel } = require("../../modules/products/product.model");
const { OrderModel } = require("../../modules/order/order.model");
const { SavedItemsModel } = require("../../modules/savedItems/savedItem.model");
const { WalletModel } = require("../../modules/wallet/wallet.model");
const { ReportModel } = require("../../modules/reports/reports.model");
const { ReviewModel } = require("../../modules/reviews/reviews.model");
const { TransactionModel } = require("../../modules/transaction/transaction.model");


// const checkPermissions = (resource, action) => {
//     return async(req, res, next) => {
//         try {
//             const userId = req.user._id;
//             const user = await UserModel.findById(userId).populate({
//                 path: 'roles',
//                 populate: {path: 'permissions', match: {resource}}
//             }).populate({
//                 path: 'directPermissions',
//                 match: {resource}
//             })
        
//             // Get all permissions across roles (including inherited ones)
//             const permissions = [
//                 ...user.directPermissions.map(p => ({
//                   resource: p.resource,
//                   actions: p.actions,
//                 })),
//                 ...user.roles.flatMap(role => 
//                   role.permissions.map(p => ({
//                     resource: p.resource,
//                     actions: p.actions,
//                   }))
//                 )
//               ];
              
          
//             // Check if the user has access to the requested resource and action
//             const hasAccess = permissions.some(async (p) => {
//                 if (p.resource === resource && p.actions.includes(action)) {
//                     // Check ownership only if the action involves ownership (e.g., "Own")
//                     if (action.includes('Own')) {
//                         const isOwner = await isResourceOwner(req, resource, userId);
//                         return isOwner; // Ensure ownership check passes
//                     }
//                     return true; // No ownership needed, global access
//                 }
//                 return false;
//             });
//             console.log(hasAccess)
             
//             if(!hasAccess) throw new createHttpError.Forbidden('You do not have permission to perform this action')
//             next()
//         } catch (error) {
//             next(error)
//         }
//     }
// }

// Updated checkPermissions middleware
const checkPermissions = (resource, requiredAction) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id;
            const user = await UserModel.findById(userId)
                .populate({
                    path: 'roles',
                    populate:[
                        { path: 'permissions', match: { resource } },
                        {path: 'inherits', populate: 'permissions'}
                        ]
                })
                .populate({
                    path: 'directPermissions',
                    match: { resource }
                });
            console.log(user)

            let permissions = [
                ...user.directPermissions,
                ...user.roles.flatMap(role => role.permissions),
                ...getInheritedRolePermissions(user.roles)
            ];


          
              // 1. Check explicit permission first
            const hasExplicitAccess = permissions.some(p => 
                p.resource === resource && 
                p.actions.includes(requiredAction)
            );

            // 2. Check ownership if needed
            const requiresOwnership = requiredAction.endsWith('Own');
            let hasAccess = hasExplicitAccess;

            if (requiresOwnership && !hasExplicitAccess) {
                const baseAction = requiredAction.replace('Own', '');
                const hasBasePermission = permissions.some(p => 
                    p.resource === resource && 
                    p.actions.includes(baseAction)
                );
                hasAccess = hasBasePermission && await isResourceOwner(req, resource, userId);
            }

            console.log('Final Access:', hasAccess);
            if (!hasAccess) throw new createHttpError.Forbidden();
            next();
        } catch (error) {
            next(error);
        }
    };
};

const getInheritedRolePermissions = (roles, visited = new Set()) => {
    return roles.flatMap(role => {
      if (visited.has(role._id)) return [];
      visited.add(role._id);
  
      return [
        ...role.permissions,
        ...getInheritedRolePermissions(role.inherits, visited)
      ];
    });
  };

const isResourceOwner = async (req, resourceType, userId) => {
   try {
    let resourceDoc;

    switch (resourceType) {
        case APP_RESOURCES.Cart:
            resourceDoc = await CartModel.findOne({ userId });
            break;

        case APP_RESOURCES.Category:
            return req.user.roles.includes('admin');

        case APP_RESOURCES.Features:
            return req.user.roles.includes('admin');

        case APP_RESOURCES.Product:
            return req.user.roles.includes('admin');

        case APP_RESOURCES.Order:
            resourceDoc = await OrderModel.findOne({
                _id: req.params.id,
                user: userId
            });
            break;
        case APP_RESOURCES.Report:
            resourceDoc = await ReportModel.findOne({
                _id: req.params.id,
                reporter: userId
            });
            break;
        case APP_RESOURCES.Review:
            resourceDoc = await ReviewModel.findOne({
                _id: req.params.id,
                userId
            });
            break;

        case APP_RESOURCES.SavedItems:
            resourceDoc = await SavedItemsModel.findOne({userId });
            break;
        case APP_RESOURCES.Transaction:
            resourceDoc = await TransactionModel.findOne({user: userId , _id: req.params.id});
            break;
        case APP_RESOURCES.Wallet:
            resourceDoc = await WalletModel.findOne({user:userId , _id: req.params.id});
            break;
        case APP_RESOURCES.User:
            resourceDoc = await UserModel.findOne({ _id: req.params.id});
            break;
        default:
            throw new createHttpError.BadRequest('Unsupported resource type');
    }

    if (!resourceDoc) {
        throw new createHttpError.NotFound(`${resourceType} not found`);
    }

    // Check if the resource's owner matches the userId
    return resourceDoc?.owner?.equals?.(userId) || false;
   } catch (error) {
    throw error
   } 
};
// const isResourceOwner = (req, ) => {
//     const ownerShipCheck = {
//         [APP_RESOURCES.Product]: () => req.product.owner.equals(req.user.id),
//         [APP_RESOURCES.Category]: () => req.user.roles.includes('admin'),
//         [APP_RESOURCES.Cart]: () => req.cart.owner.equals(req.user._id),
//         [APP_RESOURCES.Features]: () => req.user.roles.includes('admin'),
//         [APP_RESOURCES.Order]: () => req.cart.owner.equals(req.user.id),
//     }
//     return ownerShipCheck[req.resourceType] ? ownerShipCheck[req.resourceType]() : false;
// }


module.exports = {
    checkPermissions,
}
