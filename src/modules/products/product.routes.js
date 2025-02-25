const Authentication = require("../../common/guard/authentication")
const { checkPermissions } = require("../../common/middlewares/authz")
const { stringToArray } = require("../../common/middlewares/mid.functions")
const { uploadFileMulter } = require("../../common/middlewares/multer")
const { ProductController } = require("./product.controller")

const ProductRoutes = require("express").Router()

ProductRoutes.post("/add",Authentication, uploadFileMulter.array("images", 10), stringToArray("tags"), ProductController.addProduct)
ProductRoutes.get("/all", Authentication , ProductController.getAllProducts)
ProductRoutes.get("/:id", ProductController.getOneProductById)
ProductRoutes.delete("/remove/:id",Authentication, ProductController.deleteProductById)
ProductRoutes.patch("/update/:productId", Authentication, uploadFileMulter.array("images", 10) , stringToArray("tags"), ProductController.updateProduct)

module.exports = {
    ProductRoutes
}

