const Authentication = require("../../common/guard/authentication")
const { stringToArray } = require("../../common/middlewares/mid.functions")
const { uploadFileMulter } = require("../../common/middlewares/multer")
const { ProductController } = require("./product.controller")

const ProductRoutes = require("express").Router()

ProductRoutes.post("/add",Authentication, uploadFileMulter.array("images", 10), stringToArray("tags"), ProductController.addProduct)
ProductRoutes.get("/all", ProductController.getAllProducts)
ProductRoutes.get("/:id", ProductController.getOneProductById)
ProductRoutes.delete("/remove/:id", Authentication, ProductController.deleteProductById)
ProductRoutes.patch("/update/:id", Authentication, uploadFileMulter.array("images", 10) , stringToArray("tags"), ProductController.updateProduct)

module.exports = {
    ProductRoutes
}

