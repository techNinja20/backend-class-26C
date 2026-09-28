const db = require("../../src/../db/db")

async function selectAll(tableName) {
  return await db.query(`SELECT * FROM ${tableName}`)
}



async function checkIfEmailExist (tableName, email) {
  return await db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email])
}

async function insertIntoTable (tableName, {customer_id, firstName, lastName, email, passwordSalt, passwordHash}) {
  return await db.query(
      `INSERT INTO ${tableName}(customer_id,firstName,lastName,email,passwordSalt,passwordHash)values(?,?,?,?,?,?)`,
      [customer_id, firstName, lastName, email, passwordSalt, passwordHash],)
}

module.exports = { selectAll, checkIfEmailExist, insertIntoTable }