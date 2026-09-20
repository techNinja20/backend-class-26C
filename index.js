const express = require("express")
const app = express()
const PORT = 5768
const Joi = require("joi")
const mysql = require("mysql2/promise")

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "product_db",
  port: 8889,
})

function throwError(message, errorCode = 400) {
  const error = new Error(message)
  error.statusCode = errorCode
  throw error
}

const productSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "product name is required",
    "string.min": "abeg make e pass 3",
    "any.required": "Please provide the name",
  }),
  price: Joi.number().integer().min(1).required().messages({
    "number.empty": "provide number",
    "number.min": "make e pass 0",
  }),
  description: Joi.string().min(3).max(30).required(),
})

const userSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password"),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
})

function validation(schema) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body)

    if (error) {
      throwError(error.details.map((err) => err.message).join(""))
    }
    next()
  }
}

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to backend class",
  })
})

app.get("/products", async (req, res, next) => {
  try {
    const [data] = await connection.query("SELECT * FROM products")

    res.status(200).json({
      status: true,
      message: "Products successfully fetched",
      data: data,
    })
  } catch (error) {
    next(error)
  }
})

app.get("/product/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const [result] = await connection.query(
      "SELECT * FROM products where id = ?",
      [id],
    )

    console.log("result:", result)
    if (result.length === 0) {
      throwError("Product not found.")
    }

    res.status(200).json({
      status: true,
      message: "Product fetched",
      data: result[0],
    })
  } catch (error) {
    next(error)
  }
})

app.post("/products", validation(productSchema), async (req, res, next) => {
  try {
    const { name, price, description } = req.body

    await connection.query(
      `insert into products(name,price,description)values(?,?,?)`,
      [name, price, description],
    )

    res.status(201).json({
      status: true,
      message: "Product created succefully",
    })
  } catch (error) {
    next(error)
  }
})

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
