const Joi = require("joi")

const productSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "product name is required",
    "string.min": "abeg make e pass 3",
    "any.required": "Please provide the name",
  }),
  price: Joi.number().integer().min(1).required().messages({
    "number.empty": "provide number",
    "number.min": "make e pass 0",
  }),
  description: Joi.string().min(3).max(30).required(),
})

const userSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
})

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
})

const resetPassword = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
})

module.exports = { productSchema, userSchema, loginSchema, resetPassword }
