const {Router} = require("express")
const { FeaturesController } = require("./features.controller")
const FeatureRoutes = Router()

FeatureRoutes.post("/add", FeaturesController.addFeatures)
FeatureRoutes.get("/all", FeaturesController.getAllFeatures)
FeatureRoutes.get("/by-category/:categoryId", FeaturesController.getFeaturesByCategoryId)
FeatureRoutes.delete("/remove/:id", FeaturesController.removeFeatureById)
FeatureRoutes.put("/update/:id", FeaturesController.updateFeatures)

module.exports = {
    FeatureRoutes
}