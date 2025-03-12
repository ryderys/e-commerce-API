const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("../../common/validations/validation.msg");


const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const addReviewSchema = Joi.object({
    params: Joi.object({
        productId: Joi.string().pattern(MongoIDPattern).required().error(httpErrors.BadRequest(ValidationMsg.InvalidId))
    }),
    body: Joi.object({
        rating: Joi.number().integer().min(1).max(5).required().error(httpErrors.BadRequest(ValidationMsg.InvalidRating)),
        comment: Joi.string().trim().max(400).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidComment))
    })
})

const updateReviewSchema = Joi.object({
    params: Joi.object({
        productId: Joi.string().pattern(MongoIDPattern).required().error(httpErrors.BadRequest(ValidationMsg.InvalidId))
    }),
    body: Joi.object({
        rating: Joi.number().integer().min(1).max(5).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidRating)),
        comment: Joi.string().trim().max(400).optional()
    })
})

const getReviewSchema = Joi.object({
    params: Joi.object({
        productId: Joi.string().pattern(MongoIDPattern).required()
    })
})
const deleteReviewSchema = Joi.object({
    params: Joi.object({
        reviewId: Joi.string().pattern(MongoIDPattern).required()
    })
})

module.exports = {
    addReviewSchema,
    updateReviewSchema,
    getReviewSchema,
    deleteReviewSchema
}