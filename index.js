const express = require("express")
const app = express()
const PORT = 5768
const Joi = require("joi")

const allProducts = [
  {
    id: 1,
    name: "iPhone 18",
    price: 1999,
    description: "128GB, color blue",
  },
  {
    id: 2,
    name: "Samsung Z Fold",
    price: 15000,
    description: "256GB, color white",
  },
  {
    id: 3,
    name: "Tecno",
    price: 300,
    description: "100GB, color black",
  },
  {
    id: 4,
    name: "MI",
    price: 800,
    description: "150GB, color purple",
  },
]

const users = []

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

app.get("/products", (req, res) => {
  const { price, name } = req.query

  let filteredProducts = [...allProducts]

  //   if (price) {
  //   filteredProducts = filteredProducts.filter((data) => {
  //     if (name) {
  //       return data.price >= price || data.name === name
  //     } else if (!name) {
  //       return data.price >= price
  //     } else {
  //       return data
  //     }
  //   })
  // }

  if (price) {
    filteredProducts = filteredProducts.filter(
      (data) => data.price >= parseInt(price),
    )
  }

  if (name) {
    filteredProducts = filteredProducts.filter(
      (data) => data.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
    )
  }

  if (filteredProducts.length === 0) {
    filteredProducts = allProducts
  }

  res.status(200).json({
    status: true,
    message: "All products fetched successfully",
    data: filteredProducts,
  })
})

app.post("/create", validation(productSchema), (req, res, next) => {
  try {
    const { name, price, description } = req.body

    const product = {
      id: allProducts.length + 1,
      name,
      price,
      description,
    }

    allProducts.push(product)

    res.status(201).json({
      status: true,
      message: "Product created successfully",
    })
  } catch (error) {
    next(error)
  }
})

app.get("/product/:_id", (req, res, next) => {
  try {
    const { _id } = req.params

    const getProduct = allProducts.find((data) => data.id === Number(_id))

    if (getProduct === undefined) {
      throwError("No product found")
    }

    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: getProduct,
    })
  } catch (error) {
    next(error)
  }
})

app.patch("/product/:_id", validation(productSchema), (req, res, next) => {
  try {
    const { _id } = req.params
    const { name, price, description } = req.body

    const productToUpdate = allProducts.find((data) => data.id === Number(_id))

    if (!productToUpdate) {
      throwError("Product not found")
    }

    //   const result = Object.entries(req.body)
    //   const mapIt = result.map((data) => {
    //     return (productToUpdate[data[0]] = data[1])
    //   })

    if (name) productToUpdate.name = name
    if (price) productToUpdate.price = price
    if (description) productToUpdate.description = description

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
    })
  } catch (error) {
    next(error)
  }
})

app.delete("/product/:_id", (req, res, next) => {
  try {
    const { _id } = req.params

    const productToDelete = allProducts.findIndex(
      (del) => del.id === Number(_id),
    )

    if (productToDelete === -1) {
      throwError("No product found")
    }

    const [deletdProduct] = allProducts.splice(productToDelete, 1)

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: `Product ${deletdProduct.name} with price $${deletdProduct.price} has been deleted.`,
    })
  } catch (error) {
    next(error)
  }
})

app.post("/user", validation(userSchema), (req, res, next) => {
  try {
    const { user_name, password, email } = req.body
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
