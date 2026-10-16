const { default: axios } = require("axios")

const base_url = "https://fakestoreapi.com"

const getAllProducts = async () => {
  try {
    const response = await axios(`${base_url}/products`, {
      method: "GET",
    })

    return response.data
  } catch (error) {
    console.log(error)
  }
}

const postProduct = async (title, price, description, category, image) => {
  try {
    const response = await axios(`${base_url}/products`, {
      method: "POST",
      data: { title, price, description, category, image },
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getAllProducts, postProduct }
