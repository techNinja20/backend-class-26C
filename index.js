require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3007
const db = require("./config/db")
const userRouter = require("./src/routers/users.routers")

app.use(express.json())

app.use("/api/v1", userRouter)

async function checkConnection() {
  try {
    const connect = await db.getConnection()
    console.log("✅ connected to the server")
    connect.release()
  } catch (error) {
    // console.log(error)
    console.log("❌ Your server is not connected")
  }
}

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "This endpoint is not available.",
  })
})

//Centralized error
app.use((err, req, res, next) => {
  const code = err.statusCode || 500

  res.status(code).json({
    status: false,
    message: err.message || "Internal server error",
  })
})

checkConnection()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
