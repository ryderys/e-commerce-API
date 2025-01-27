const Joi = require("joi");
const httpErrors = require("http-errors");
const { ValidationMsg } = require("./validation.msg");

const AddToCartSchema = Joi.object({
    productId: Joi.string().required().error(httpErrors.BadRequest(ValidationMsg.InvalidId)),
    quantity: Joi.number().integer().min(1).required().error(httpErrors.BadRequest(ValidationMsg.InvalidQuantity))
})

const UpdateItemQuantitySchema = Joi.object({
    productId: Joi.string().required().error(httpErrors.BadRequest(ValidationMsg.InvalidId)),
    quantity: Joi.number().integer().min(1).error(httpErrors.BadRequest(ValidationMsg.InvalidQuantity))
})
const RemoveFromCartSchema = Joi.object({
    productId: Joi.string().required().error(httpErrors.BadRequest(ValidationMsg.InvalidId)),
})
const QuantitySchema = Joi.object({
    quantity: Joi.number().integer().min(1).required().error(httpErrors.BadRequest(ValidationMsg.InvalidQuantity))
})

module.exports = {
    AddToCartSchema,
    UpdateItemQuantitySchema,
    RemoveFromCartSchema,
    QuantitySchema
}
