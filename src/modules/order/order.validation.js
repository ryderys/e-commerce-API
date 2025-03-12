const Joi = require("joi");

const shippingSchema = Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    paymentMethod: Joi.string().valid('credit_card', 'paypal').required()
})

const StatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered').required(),
    trackingNumber: Joi.string().when('status', {
        is: 'shipped',
        then: Joi.required()
    })
})

module.exports = {
    shippingSchema,
    StatusSchema
}