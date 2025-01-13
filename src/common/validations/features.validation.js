const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("./validation.msg");
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const createFeatureSchema = Joi.object({
    title: Joi.string().required().error(httpErrors.BadRequest(ValidationMsg.InvalidTitle)),
    key: Joi.string().required().error(httpErrors.BadRequest(ValidationMsg.InvalidKey)),
    type: Joi.string().valid('number', 'string', 'array', 'boolean').required().error(httpErrors.BadRequest(ValidationMsg.InvalidType)),
    list: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).error(httpErrors.BadRequest(ValidationMsg.InvalidList)),
    guid: Joi.string().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidGuid)),
    category: Joi.string().pattern(MongoIDPattern).required().error(httpErrors.BadRequest(ValidationMsg.InvalidCategoryId))
})
const updateFeatureSchema = Joi.object({
    title: Joi.string().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidTitle)),
    key: Joi.string().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidKey)),
    type: Joi.string().valid('number', 'string', 'array', 'boolean').optional().error(httpErrors.BadRequest(ValidationMsg.InvalidType)),
    list: Joi.alternatives().try(Joi.array(), Joi.string()).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidList)),
    guid: Joi.string().optional().error(httpErrors.BadRequest(ValidationMsg.InvalidGuid)),
    category: Joi.string().pattern(MongoIDPattern).optional().error(httpErrors.BadRequest(ValidationMsg.InvalidCategoryId))
})

module.exports = {
    createFeatureSchema,
    updateFeatureSchema
}