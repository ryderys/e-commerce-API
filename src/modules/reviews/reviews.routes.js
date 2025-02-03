const Authentication = require("../../common/guard/authentication")
const { ReviewController } = require("./reviews.controller")

const ReviewRoutes = require("express").Router()

ReviewRoutes.post("/products/:productId", Authentication ,ReviewController.addReview)
ReviewRoutes.get("/products/:productId", Authentication, ReviewController.getReviews)
ReviewRoutes.put("/products/:reviewId", Authentication, ReviewController.updateReview)

ReviewRoutes.delete("/products/:reviewId", Authentication, ReviewController.deleteReview)

module.exports = {
    ReviewRoutes
}