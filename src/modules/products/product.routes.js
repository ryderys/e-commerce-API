const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const { stringToArray } = require("../../common/middlewares/mid.functions")
const { uploadFileMulter } = require("../../common/middlewares/multer")
const { ProductController } = require("./product.controller")

const ProductRoutes = require("express").Router()

ProductRoutes.post("/add",adminAuthMiddleware, checkPermissions(APP_RESOURCES.PRODUCT, 'create'), uploadFileMulter.array("images", 10), stringToArray("tags"), ProductController.addProduct)
ProductRoutes.get("/all" ,adminAuthMiddleware , ProductController.getAllProducts)
ProductRoutes.get("/:id", ProductController.getOneProductById)
ProductRoutes.delete("/remove/:id",adminAuthMiddleware,checkPermissions(APP_RESOURCES.PRODUCT, 'deleteOwn'), ProductController.deleteProductById)
ProductRoutes.patch("/update/:productId", adminAuthMiddleware, checkPermissions(APP_RESOURCES.PRODUCT, 'updateOwn'), uploadFileMulter.array("images", 10) , stringToArray("tags"), ProductController.updateProduct)

module.exports = {
    ProductRoutes
}

