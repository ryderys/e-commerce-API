const {Router} = require("express")
const { FeaturesController } = require("./features.controller")
const adminAuthMiddleware = require("../../common/guard/authorizeRole")
const { checkPermissions } = require("../../common/middlewares/authz")
const APP_RESOURCES = require("../../common/constants/resources")
const FeatureRoutes = Router()

FeatureRoutes.post("/add", adminAuthMiddleware, checkPermissions(APP_RESOURCES.FEATURES, 'create'), FeaturesController.addFeatures)
FeatureRoutes.get("/all",  FeaturesController.getAllFeatures)
FeatureRoutes.get("/by-category/:categoryId", FeaturesController.getFeaturesByCategoryId)
FeatureRoutes.delete("/remove/:id", adminAuthMiddleware, checkPermissions(APP_RESOURCES.FEATURES, 'deleteOwn'), FeaturesController.removeFeatureById)
FeatureRoutes.put("/update/:id",adminAuthMiddleware, checkPermissions(APP_RESOURCES.FEATURES, 'updateOwn'), FeaturesController.updateFeatures)

module.exports = {
    FeatureRoutes
}