const Joi = require("joi");

const updateProfileSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(20).optional(),
    username: Joi.string().lowercase().trim().optional(),
    email: Joi.string().email().lowercase().trim().optional()
})

module.exports = {
    updateProfileSchema
}