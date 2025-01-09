const { uploadFileMulter } = require("../../common/middlewares/multer")
const { ProductController } = require("./product.controller")

const productRoutes = require("express").Router()

productRoutes.post("/add", uploadFileMulter.array("images", 10), ProductController.addProduct)

productRoutes.patch("/update/:id", uploadFileMulter.array("images", 10), ProductController.updateProduct)