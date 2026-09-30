const jwt = require("jsonwebtoken")
const { checkIfEmailExist } = require("../models")
const { isEmpty, throwError } = require("../utils")

const authorizationMiddleware = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).json({
      status: false,
      message: "Unauthorized access",
    })
    return
  } else {
    const token = authorization.split(" ")[1]

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: "Unauthorized access",
        })
        return
      }
      const [[result]] = await checkIfEmailExist("user_tb", decoded.email)

      if (isEmpty(result)) {
        res.status(404).json({
          status: false,
          message: "Unauthorized access",
        })
        return
      }

      req.customer_id = result.customer_id
      

      next()
    })
  }
}

module.exports = authorizationMiddleware
