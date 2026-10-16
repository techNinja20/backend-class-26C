const { MongoClient } = require("mongodb")

const url = process.env.MONGODB_URI || "mongodb://localhost:27017"

const client = new MongoClient(url)

const dbName = process.env.MONGODB_NAME

let db



const connectDB = async () => {
  try {
    await client.connect()
    db = client.db(dbName)
    console.log("Connected successfully to server")

    return db
  } catch (error) {
    console.log("mongoDb connection failed:", error.message)
  }
}

const getDb = () => {
  if (db) {
    console.log(`${db} is connected`)
  }
  return db
}

module.exports = { connectDB, getDb }
