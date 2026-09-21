const express = require("express")
const validation = require("../middlewares/validationMiddleware")
const { userSchema, loginSchema, resetPassword } = require("../schemas")
const {
  getUsers,
  createUser,
  loginUser,
  startResetPassword,
  completeResetPassword,
} = require("../controllers/users.controllers")
const router = express.Router()

router.get("/users", getUsers)

router.post("/create", validation(userSchema), createUser)

router.post("/login", validation(loginSchema), loginUser)

router.post(
  "/start-reset-password",
  validation(resetPassword),
  startResetPassword,
)

router.patch("/complete-reset-password/:email/:otp", completeResetPassword)

module.exports = router
