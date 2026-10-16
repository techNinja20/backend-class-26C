require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3007
const userRouter = require("./src/routers/users.routers")
const connectDB = require("./config/db")

app.use(express.json())

app.use("/api/v1", userRouter)

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

//

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log("error:", error)
  }
}

startServer()
