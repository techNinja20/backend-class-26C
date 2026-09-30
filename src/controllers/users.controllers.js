const db = require("../../db/db")
const messages = require("../messages")
const { selectAll, checkIfEmailExist, insertIntoTable } = require("../models")
const { throwError, generateOtp, isEmpty } = require("../utils")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const [checkIfEmailExists] = await checkIfEmailExist("user_tb", email)

    if (!isEmpty(checkIfEmailExists)) {
      throwError(messages.userExists)
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // const registrationData = req.body
    // const customer_id = uuidv4()

    await insertIntoTable("user_tb", {
      customer_id: uuidv4(),
      firstName,
      lastName,
      email,
      passwordSalt: salt,
      passwordHash: hashedPassword,
    })

    const otpCode = generateOtp()
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes

    await db.query("INSERT INTO otp(email,otpCode,expiredAt)values(?,?,?)", [
      email,
      otpCode,
      expiredAt,
    ])

    res.status(201).json({
      status: true,
      message: messages.otpSent,
    })
  } catch (error) {
    next(error)
  }
}

const getSingleUser = async (req, res, next) => {
  const userId = req.customer_id

  console.log("userId:", userId)

  const [[getSingleUser]] = await db.query(
    "SELECT * FROM user_tb where customer_id = ? ",
    [userId],
  )

  res.status(200).json({
    status: true,
    message: "User fetchecd",
    data: getSingleUser,
  })

  try {
  } catch (error) {
    next(error)
  }
}

const verifyUser = async (req, res, next) => {
  try {
    const { email, otpCode } = req.params

    const [[checkIfOtpIsValid]] = await db.query(
      "SELECT * FROM otp where email = ? and otpCode=?",
      [email, otpCode],
    )

    if (isEmpty(checkIfOtpIsValid)) {
      throwError("Invalid OTP")
    }

    if (new Date(checkIfOtpIsValid.expiredAt) < new Date()) {
      throwError("OTP has expired")
      await db.query("DELETE FROM otp WHERE email = ?", [email])
    }

    await db.query("DELETE FROM otp WHERE email = ?", [email])

    // await db.query("UPDATE user_tb set isVerified = ? where email = ?", [
    //   true,
    //   email,
    // ])
    res.status(200).json({
      status: true,
      message: messages.userVerified,
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const [[checkIfEmailExists]] = await checkIfEmailExist("user_tb", email)

    if (isEmpty(checkIfEmailExists)) {
      throwError(messages.userDoesNotExist)
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      checkIfEmailExists.passwordHash,
    )

    if (!isPasswordValid) {
      throwError(messages.invalidEmailOrPassword)
    }
    const payload = {
      id: uuidv4(),
      firstName: checkIfEmailExists.firstName,
      lastName: checkIfEmailExists.lastName,
      email: checkIfEmailExists.email,
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      function (err, token) {
        if (err) {
          throwError(err.message)
        }
        res.header("token", token)
        res.status(200).json({
          status: true,
          message: "Login Successfully",
        })
      },
    )
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const [users] = await selectAll("user_tb")

    res.status(200).json({
      status: true,
      message: "Users fetched",
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

const startResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const [[checkIfEmailExists]] = await db.query(
      "SELECT * FROM user_tb where email = ?",
      [email],
    )

    if (checkIfEmailExists === undefined) {
      throwError("You don not have an account with us, please signup")
    }

    const otp = generateOtp()

    await db.query("INSERT INTO otp(email,otp)values(?,?)", [email, otp])

    res.status(201).json({
      status: true,
      message: "Check your email for otp code",
    })
  } catch (error) {
    next(error)
  }
}
const completeResetPassword = async (req, res, next) => {
  try {
    const { email, otp } = req.params

    const [[checkIfOtpIsValid]] = await db.query(
      "SELECT * FROM otp where email = ? and otp=?",
      [email, otp],
    )

    if (checkIfOtpIsValid === undefined) {
      throwError("Invalid OTP")
    }

    await db.query("UPDATE user_tb set password = ? where email = ?", [
      req.body.password,
      email,
    ])

    await db.query("delete from otp where email = ?", [email])

    res.status(200).json({
      status: true,
      message: "Password updated",
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  createUser,
  verifyUser,
  loginUser,
  startResetPassword,
  completeResetPassword,
  getSingleUser,
}

