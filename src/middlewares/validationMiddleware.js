const { throwError } = require("../utils")

function validation(schema) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body)

    if (error) {
      throwError(error.details.map((err) => err.message).join(""))
    }
    next()
  }
}

module.exports = validation
