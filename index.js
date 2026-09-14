const express = require("express")

const app = express()

const PORT = 5768

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

function throwError(message, code = 400) {
  const error = new Error(message)
  error.statusCode = code
  throw error
}

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to backend class",
  })
})

app.get("/products", (req, res) => {
  res.status(200).json({
    status: true,
    message: "All products fetched successfully",
    data: allProducts,
  })
})

app.post("/create", (req, res, next) => {
  try {
    const { name, price, description } = req.body

    if (!name || !price || !description) {
      throwError("All fields are required.")
    }

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

app.patch("/product/:_id", (req, res, next) => {
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
  } catch (err) {
    next(err)
  }
})

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "This endpoint is not available.",
  })
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: false,
    message: err.message || "Inetrnal Server Error",
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
