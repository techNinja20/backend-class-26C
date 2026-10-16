const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_NAME = process.env.MONGODB_NAME

const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGODB_URI}/${MONGODB_NAME}`)

    console.log("Mongodb connected successfully")
  } catch (error) {
    console.log("Not connected:", error.message)
  }
}

module.exports = connectDB
