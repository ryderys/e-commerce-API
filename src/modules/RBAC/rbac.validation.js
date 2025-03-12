const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("../../common/validations/validation.msg");
const Permissions = require("../../modules/RBAC/premissions");
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const permissionsEnum = Object.keys(Permissions)
const actionsEnum = Object.keys(Permissions).reduce((acc, resource) => {
    Object.keys(Permissions[resource]).forEach(action => {
        if (!acc.includes(action)) {
            acc.push(action);
        }
    });
    return acc;
}, []);


const addRoleSchema = Joi.object({
    roleName: Joi.string().valid('guest', 'admin', 'user').required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    userId: Joi.string().pattern(MongoIDPattern).required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    // permission: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(httpErrors.BadRequest(ValidationMsg.InvalidPermission)),
})

const roleSchema = Joi.object({
    role: Joi.string().valid('guest', 'admin', 'user').required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    permissions: Joi.array().items(
        Joi.object({
            resource: Joi.string().valid(...permissionsEnum).required().error(httpErrors.BadRequest(ValidationMsg.InvalidResource)),
            action: Joi.string().valid(...actionsEnum).required().error(httpErrors.BadRequest(ValidationMsg.InvalidAction))
        })
    ).error(httpErrors.BadRequest(ValidationMsg.InvalidPermission)),

})

const GrantPermissionSchema = Joi.object({
    userId: Joi.string().pattern(MongoIDPattern).required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    permissions: Joi.array().items(
        Joi.object({
            resource: Joi.string().valid(...permissionsEnum).required().error(httpErrors.BadRequest(ValidationMsg.InvalidResource)),
            action: Joi.string().valid(...actionsEnum).required().error(httpErrors.BadRequest(ValidationMsg.InvalidAction))
        })
    ).error(httpErrors.BadRequest(ValidationMsg.InvalidPermission)),
})


const addPermissionSchema = Joi.object({
    name: Joi.string().valid('guest', 'admin', 'user').required().error(httpErrors.BadRequest(ValidationMsg.InvalidRole)),
    description: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(httpErrors.BadRequest(ValidationMsg.InvalidPermission)),
})

module.exports = {
    addRoleSchema,
    roleSchema,
    GrantPermissionSchema
}
