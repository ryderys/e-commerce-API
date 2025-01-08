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
    features: Joi.object().pattern(
        Joi.string(),
        Joi.alternatives().try(
            Joi.string(),
            Joi.number(),
            Joi.boolean(),
            Joi.array().items(Joi.string())
        )
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
    features: Joi.object().pattern(
        Joi.string(),
        Joi.alternatives().try(
            Joi.string(),
            Joi.number(),
            Joi.boolean(),
            Joi.array().items(Joi.string())
        )).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidType)),
    filename: Joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg)$/i).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidFileFormat)),
    fileUploadPath: Joi.allow().optional(),
    // images: Joi.array().items(Joi.string()).optional()
}).unknown(false)

module.exports = {
    createProductSchema,
    updateProductSchema
}