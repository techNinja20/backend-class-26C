const express = require("express")
const validation = require("../middlewares/validationMiddleware")
const { userSchema, loginSchema, resetPassword } = require("../schemas")
const {
  getUsers,
  createUser,
  loginUser,
  startResetPassword,
  completeResetPassword,
  verifyUser,
  getSingleUser,
} = require("../controllers/users.controllers")
const authorizationMiddleware = require("../middlewares/authorizationMiddleware")
const router = express.Router()

router.get("/users", getUsers)

router.get("/user",authorizationMiddleware, getSingleUser)

router.post("/create", validation(userSchema), createUser)

router.get("/verify-user/:email/:otpCode", verifyUser)

router.post("/login", validation(loginSchema), loginUser)

router.post(
  "/start-reset-password",
  validation(resetPassword),
  startResetPassword,
)

router.patch("/complete-reset-password/:email/:otp", completeResetPassword)

module.exports = router
