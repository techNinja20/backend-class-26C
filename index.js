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

app.post("/create", (req, res) => {
  const { name, price, description } = req.body

  if (!name || !price || !description) {
    res.status(400).json({
      status: false,
      message: "All fields are required.",
    })
    return
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
})

app.get("/product/:_id", (req, res) => {
  const { _id } = req.params

  const getProduct = allProducts.find((data) => data.id === Number(_id))

  if (getProduct === undefined) {
    res.status(400).json({
      status: false,
      message: "No product found",
    })
    return
  }

  res.status(200).json({
    status: true,
    message: "Product fetched successfully",
    data: getProduct,
  })
})

app.patch("/product/:_id", (req, res) => {
  const { _id } = req.params
  const { name, price, description } = req.body

  const productToUpdate = allProducts.find((data) => data.id === Number(_id))

  if (!productToUpdate) {
    res.status(400).json({
      status: false,
      message: "Product not found",
    })
    return
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
})

app.delete("/product/:_id", (req, res) => {
  const { _id } = req.params

  const productToDelete = allProducts.findIndex((del) => del.id === Number(_id))

  if (productToDelete === -1) {
    res.status(400).json({
      status: false,
      message: "No product found",
    })
    return
  }

  const [deletdProduct] = allProducts.splice(productToDelete, 1)

  res.status(200).json({
    status: true,
    message: "Product deleted successfully",
    data: `Product ${deletdProduct.name} with price $${deletdProduct.price} has been deleted.`,
  })
})

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "This endpoint is not available.",
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
