const httpError = require("http-errors");
const { ReviewModel } = require("./reviews.model");
const { ReviewMsg } = require("./reviews.msg");
const {ProductModel} = require("../products/product.model");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
class ReviewController{
    
    async addReview(req, res, next){
        try {
            const {productId, rating, comment} = req.body;
            const userId = req.user.id;
            const existingReview = await ReviewModel.findOne({userId, productId})
            if(existingReview){
                throw new httpError.BadRequest(ReviewMsg.ReviewExists)
            }

            const review = await ReviewModel.create({
                userId,
                productId,
                rating,
                comment
            })
            
            const reviews = await ReviewModel.find({productId})
            const ratings = reviews.map(review => review.rating)

            await ProductModel.findByIdAndUpdate(productId, {
                averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
                reviewCount: reviews.length
            })
            return sendResponse(res, StatusCodes.CREATED, null, review)
            
        } catch (error) {
            next(error)
        }
    }

    async getReviews(req, res, next){
        try {
            const {productId} = req.params;
            const reviews = await ReviewModel.find({productId}).populate('userId', 'name email')
            .sort({createdAt: -1})
            return sendResponse(res, StatusCodes.OK, null, reviews)
        } catch (error) {
            next(error)
        }
    }

    async deleteReview(req, res, next){
        try {
            const userId = req.user._id;
            const {reviewId} = req.params;
            const review = await ReviewModel.findByIdAndDelete({reviewId, userId})
            if(!review) {
                throw new httpError.NotFound(ReviewMsg.ReviewNFound)
            }

            const reviews = await ReviewModel.find({productId: review.productId})
            const productUpdate = reviews.length > 0 ? {
                averageRating: reviews.reduce((sum, r) => sum + r.length, 0) / reviews.length,
                reviewCount: reviews.length
            } : {
                averageRating: 0,
                reviewCount: 0
            }
            await ProductModel.findByIdAndUpdate(review.productId, productUpdate)
            return sendResponse(res, StatusCodes.OK, ReviewMsg.ReviewDeleted)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    ReviewController: new ReviewController()
}