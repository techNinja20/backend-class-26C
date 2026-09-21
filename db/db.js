const mysql = require("mysql2/promise")


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "users",
})

module.exports = db