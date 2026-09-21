const db = require("../db/db")

async function selectAll(tableName) {
  return await db.query(`SELECT * FROM ${tableName}`)
}

module.exports = { selectAll }
