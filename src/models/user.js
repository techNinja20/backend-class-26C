const mongoose = require("mongoose")
const { Schema, model } = mongoose

const userSchema = new Schema({
  age: Number,
  firstName: String,
  gender: String,
  hobbies: [],
})

const User = model("users", userSchema)

module.exports = User
