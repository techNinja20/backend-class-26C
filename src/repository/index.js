const { getDb } = require("../../config/db")

const getCollection = (collectionName) => {
  const database = getDb()

  const collection = database.collection(collectionName)

  return collection
}

const find = async (collectionName, clause = {}) => {
  const col = getCollection(collectionName)

  const data = await col.find(clause).toArray()

  return data
}

const findOne = async (collectionName, clause = {}) => {
  const col = getCollection(collectionName)

  const data = await col.findOne(clause)

  return data
}

const insertOne = async (collectionName, value = {}) => {
  const col = getCollection(collectionName)

  const data = await col.insertOne(value)

  return data
}

const insertMany = async (collectionName, value = []) => {
  const col = getCollection(collectionName)

  const data = await col.insertMany(value)

  return data
}

module.exports = { find, findOne, insertOne, insertMany }

// db.users.updateOne({},{$set:{firstName:"Wale"}})
