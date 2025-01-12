const { uploadFileMulter } = require("../../common/middlewares/multer")
const { ProductController } = require("./product.controller")

const ProductRoutes = require("express").Router()

ProductRoutes.post("/add", uploadFileMulter.array("images", 10), ProductController.addProduct)
ProductRoutes.get("/all", ProductController.getAllProducts)
ProductRoutes.get("/:id", ProductController.getOneProductById)
ProductRoutes.delete("/remove/:id", ProductController.deleteProductById)
ProductRoutes.patch("/update/:id", uploadFileMulter.array("images", 10), ProductController.updateProduct)

module.exports = {
    ProductRoutes
}

