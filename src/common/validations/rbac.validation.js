const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("./validation.msg");
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const addRoleSchema = Joi.object({
    roleName: Joi.string().valid('guest', 'admin', 'user').required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    userId: Joi.string().pattern(MongoIDPattern).required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    // permission: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(httpErrors.BadRequest(ValidationMsg.InvalidPermission)),
})


const addPermissionSchema = Joi.object({
    name: Joi.string().valid('guest', 'admin', 'user').required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    description: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(httpErrors.BadRequest(ValidationMsg.InvalidPermission)),
})

module.exports = {
    addRoleSchema
}
