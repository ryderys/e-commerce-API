const Joi = require("joi");

const shippingSchema = Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    paymentMethod: Joi.string().valid('credit_card', 'paypal').required()
})

module.exports = {
    shippingSchema
}