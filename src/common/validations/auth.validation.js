const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("./validation.msg");

const getOtpSchema = Joi.object({
    mobile: Joi.string().length(11).pattern(/^09[0-9]{9}/).messages({
        'string.pattern.base': ValidationMsg.invalidMobile,
        'string.empty': ValidationMsg.EmptyMobile,
    }).required()
})

const checkOtpSchema = Joi.object({
    mobile: Joi.string().length(11).pattern(/^09[0-9]{9}/).messages({
        'string.pattern.base': ValidationMsg.invalidMobile,
        'string.empty': ValidationMsg.EmptyMobile,
    }).required(),
    code: Joi.string().min(4).max(6).messages({
        'string.empty': ValidationMsg.EmptyCode,
        'string.min': ValidationMsg.InvalidCode,
        'string.max': ValidationMsg.InvalidCode,
    }).required()
})
module.exports = {
    getOtpSchema,
    checkOtpSchema
}
