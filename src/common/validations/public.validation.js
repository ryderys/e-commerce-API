const Joi = require("joi");
const httpErrors = require("http-errors")

const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const ObjectIdValidator = Joi.object({
    id: Joi.string().pattern(MongoIDPattern).error(httpErrors.BadRequest("the id that you provided is not valid"))
})
module.exports = ObjectIdValidator