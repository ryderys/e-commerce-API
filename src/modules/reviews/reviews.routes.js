const APP_RESOURCES = require("../../common/constants/resources")
const Authentication = require("../../common/guard/authentication")
const { checkPermissions } = require("../../common/middlewares/authz")
const { ReviewController } = require("./reviews.controller")

const ReviewRoutes = require("express").Router()

ReviewRoutes.post("/products/:productId", Authentication,checkPermissions(APP_RESOURCES.Review, 'create') ,ReviewController.addReview)
ReviewRoutes.get("/products/:productId", Authentication, checkPermissions(APP_RESOURCES.Review, 'read'),ReviewController.getReviews)
ReviewRoutes.put("/products/:reviewId", Authentication, checkPermissions(APP_RESOURCES.Review, 'updateOwn'), ReviewController.updateReview)

ReviewRoutes.delete("/products/:reviewId", Authentication,checkPermissions(APP_RESOURCES.Review, 'deleteOwn'), ReviewController.deleteReview)

module.exports = {
    ReviewRoutes
}