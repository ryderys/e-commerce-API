const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("./validation.msg");
const createProductSchema = Joi.object({
    title: Joi.string().min(3).max(30).error(httpErrors.BadRequest(ValidationMsg.InvalidTitle)).required(),
    description: Joi.string().error(httpErrors.BadRequest(ValidationMsg.InvalidDescription)),
    summary: Joi.string().error(httpErrors.BadRequest(ValidationMsg.InvalidSummary)),
    tags: Joi.array().max(10).error(httpErrors.BadRequest(ValidationMsg.InvalidTag)),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).error(httpErrors.BadRequest(ValidationMsg.InvalidCategoryId)),
    price: Joi.number().error(httpErrors.BadRequest(ValidationMsg.InvalidPrice)),
    count: Joi.number().error(httpErrors.BadRequest(ValidationMsg.InvalidQuantity)),
    // features: Joi.array().items(Joi.object().pattern(Joi.string(), Joi.array())
    // ).error(httpErrors.BadRequest(ValidationMsg.InvalidType)),
    features: Joi.array().items(
        Joi.object({
            feature: Joi.string().required(), // Feature name (e.g., "Color", "Size")
            values: Joi.array().items(Joi.string().min(1).required()) // Feature values (e.g., ["Red", "Blue"])
        })
    ).error(httpErrors.BadRequest(ValidationMsg.InvalidType)),
    filename: Joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg)$/i).error(httpErrors.BadRequest(ValidationMsg.InvalidFileFormat)),
    fileUploadPath: Joi.allow()
})

const updateProductSchema = Joi.object({
    title: Joi.string().min(3).max(30).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidTitle)),
    description: Joi.string().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidDescription)),
    summary: Joi.string().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidSummary)),
    tags: Joi.array().max(10).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidTag)),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidCategoryId)),
    price: Joi.number().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidPrice)),
    count: Joi.number().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidQuantity)),
    features: Joi.array().items(
        Joi.object({
            feature: Joi.string(), // Feature name (e.g., "Color", "Size")
            values: Joi.array().items(Joi.string().min(1)) // Feature values (e.g., ["Red", "Blue"])
        })
    ).error(httpErrors.BadRequest(ValidationMsg.InvalidType)),
    filename: Joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg)$/i).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidFileFormat)),
    fileUploadPath: Joi.allow().optional(),
    // images: Joi.array().items(Joi.string()).optional()
}).unknown(false)

module.exports = {
    createProductSchema,
    updateProductSchema
}