const { ReviewController } = require("./reviews.controller")

const ReviewRoutes = require("express").Router()

ReviewRoutes.post("/products/:productId", ReviewController.addReview)
ReviewRoutes.get("/products/:productId", ReviewController.getReviews)

ReviewRoutes.delete("/products/:reviewId", ReviewController.deleteReview)

module.exports = {
    ReviewRoutes
}