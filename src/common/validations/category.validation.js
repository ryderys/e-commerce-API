const Joi = require("joi");
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const httpErrors = require("http-errors");
const { ValidationMsg } = require("./validation.msg");

const createCategorySchema = Joi.object({
    title: Joi.string().min(3).max(30).error(httpErrors.BadRequest(ValidationMsg.InvalidTitle)),
    slug: Joi.string().error(httpErrors.BadRequest(ValidationMsg.InvalidSlug)),
    icon: Joi.string().error(httpErrors.BadRequest(ValidationMsg.InvalidIcon)),
    parent: Joi.string().optional().pattern(MongoIDPattern).error(httpErrors.BadRequest(ValidationMsg.InvalidId)),
    parents: Joi.string().optional().pattern(MongoIDPattern).error(httpErrors.BadRequest(ValidationMsg.InvalidId)),
})

module.exports = {
    createCategorySchema
}