const db = require("../db/db")
const { selectAll } = require("../models")
const { throwError, generateOtp } = require("../utils")

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

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const [checkIfEmailExists] = await db.query(
      "SELECT * FROM user_tb where email = ?",
      [email],
    )

    if (checkIfEmailExists.length > 0) {
      throwError(
        "User exists with this email, please sign up with a different email.",
      )
    }

    await db.query(
      "INSERT INTO user_tb(firstName,lastName,email,password)values(?,?,?,?)",
      [firstName, lastName, email, password],
    )

    res.status(201).json({
      status: true,
      message: "User created.",
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const [[checkIfEmailExists]] = await db.query(
      "SELECT * FROM user_tb where email = ?",
      [email],
    )

    if (checkIfEmailExists === undefined) {
      throwError("User does not exist, please create an account")
    }

    if (checkIfEmailExists.password !== password) {
      throwError("Invalid password")
    }

    res.status(200).json({
      status: true,
      message: "Login successfully",
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
  loginUser,
  startResetPassword,
  completeResetPassword,
}
