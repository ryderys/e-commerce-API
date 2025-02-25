const { AuthRoutes } = require("./modules/auth/auth.routes");
const { CartRoutes } = require("./modules/cart/cart.routes");
const { CategoryRoutes } = require("./modules/category/category.routes");
const { FeatureRoutes } = require("./modules/features/features.routes");
const { OrderRoutes } = require("./modules/order/order.routes");
const { ProductRoutes } = require("./modules/products/product.routes");
const { RbacRoutes } = require("./modules/RBAC/rbac.routes");
const { ReportRoutes } = require("./modules/reports/reports.routes");
const { ReviewRoutes } = require("./modules/reviews/reviews.routes");
const { SavedItemRoutes } = require("./modules/savedItems/savedItem.routes");
const { TransactionRoutes } = require("./modules/transaction/transaction.routes");
const { UserRoutes } = require("./modules/user/user.routes");
const { WalletRoutes } = require("./modules/wallet/wallet.routes");

const mainRouter = require("express").Router();

mainRouter.use("/auth", AuthRoutes)
mainRouter.use("/product", ProductRoutes)
mainRouter.use("/category", CategoryRoutes)
mainRouter.use("/feature", FeatureRoutes)
mainRouter.use("/cart", CartRoutes)
mainRouter.use("/bookmark", SavedItemRoutes)
mainRouter.use("/review", ReviewRoutes)
mainRouter.use("/report", ReportRoutes)
mainRouter.use("/order", OrderRoutes)
mainRouter.use('/rbac', RbacRoutes)
mainRouter.use('/user', UserRoutes)
mainRouter.use('/user', UserRoutes)
mainRouter.use('/wallet', WalletRoutes)
mainRouter.use('/transaction', TransactionRoutes)
module.exports = {
    mainRouter
}