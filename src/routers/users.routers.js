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
  getProd,
} = require("../controllers/users.controllers")
const authorizationMiddleware = require("../middlewares/authorizationMiddleware")
const router = express.Router()

router.get("/users", getUsers)

router.get("/user/:userId", getSingleUser)

router.post("/create",  createUser)

router.get("/verify-user/:email/:otpCode", verifyUser)

router.post("/login", validation(loginSchema), loginUser)

router.post(
  "/start-reset-password",
  validation(resetPassword),
  startResetPassword,
)

router.patch("/complete-reset-password/:email/:otp", completeResetPassword)


router.get('/all-products',getProd)

module.exports = router
