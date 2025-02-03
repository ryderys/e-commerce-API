const httpError = require("http-errors");
const { ReviewModel } = require("./reviews.model");
const { ReviewMsg } = require("./reviews.msg");
const {ProductModel} = require("../products/product.model");
const { sendResponse } = require("../../common/utils/helperFunctions");
const { StatusCodes } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
class ReviewController{

    
    async addReview(req, res, next){
        try {
            const { rating, comment} = req.body;
            const {productId} = req.params;
            const userId = req.user._id;
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

            const stats = await ReviewModel.aggregate([
                { $match: {productId: new mongoose.Types.ObjectId(productId)}},
                {
                    $group: {
                        _id: '$productId',
                        averageRating: { $avg: '$rating'},
                        reviewCount: { $sum: 1}
                    }
                }
            ])

            if(stats.length === 0){
                await ProductModel.findByIdAndUpdate(productId, {
                    averageRating: 0,
                    reviewCount: 0
                })
            } else {
                await ProductModel.findByIdAndUpdate(productId, {
                    averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
                    reviewCount: stats[0]?.reviewCount || 0
                })
            }

            return sendResponse(res, StatusCodes.CREATED, null, {review})
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async getReviews(req, res, next){
        try {
            const {productId} = req.params;
            const reviews = await ReviewModel.find({productId}).populate('userId', 'name email phone')
            .sort({createdAt: -1})
            return sendResponse(res, StatusCodes.OK, null, {reviews})
        } catch (error) {
            next(error)
        }
    }

    async deleteReview(req, res, next){
        try {
            const userId = req.user._id;
            const {reviewId} = req.params;
            const review = await ReviewModel.findById(reviewId)
            if(!review) {
                throw new httpError.NotFound(ReviewMsg.ReviewNFound)
            }
            if(!review.userId.equals(userId)){
                throw new httpError.Forbidden(ReviewMsg.UnAuthorizedDelete)
            }

            await review.deleteOne()

            const stats = await ReviewModel.aggregate([
                { $match: {productId: review.productId}},
                {
                    $group: {
                        _id: '$productId',
                        averageRating: { $avg: '$rating'},
                        reviewCount: { $sum: 1}
                    }
                }
            ])

            if(stats.length === 0){
                await ProductModel.findByIdAndUpdate(review.productId, {
                    averageRating: 0,
                    reviewCount: 0
                })
            } else {
                await ProductModel.findByIdAndUpdate(review.productId, {
                    averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
                    reviewCount: stats[0]?.reviewCount || 0
                })
            }
           
            return sendResponse(res, StatusCodes.OK, ReviewMsg.ReviewDeleted)
        } catch (error) {
            next(error)
        }
    }

    async updateReview(req, res, next){
        try {
            const {reviewId} = req.params;
            const {rating, comment} = req.body;
            const userId = req.user._id;

            const review = await ReviewModel.findById(reviewId)
            if(!review.userId.equals(userId)){
                throw new httpError.Forbidden(ReviewMsg.UnAuthorizedUpdate)
            }
            review.editHistory.push({
                rating: review.rating,
                comment: review.comment,
                editedAt: new Date()
            })
            
            review.rating = rating || review.rating
            review.comment = comment || review.comment
            review.edited = true

            await review.save()

            const stats = await ReviewModel.aggregate([
                { $match: {productId: review.productId}},
                {
                    $group: {
                        _id: '$productId',
                        averageRating: { $avg: '$rating'},
                        reviewCount: { $sum: 1}
                    }
                }
            ])

            if(stats.length === 0){
                await ProductModel.findByIdAndUpdate(review.productId, {
                    averageRating: 0,
                    reviewCount: 0
                })
            } else {
                await ProductModel.findByIdAndUpdate(review.productId, {
                    averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
                    reviewCount: stats[0]?.reviewCount || 0
                })
            }

            return sendResponse(res, StatusCodes.OK, ReviewMsg.ReviewUpdated, {review})

        } catch (error) {
            next(error)
        }
    }



}

module.exports = {
    ReviewController: new ReviewController()
}