require('dotenv').config()
const mysql = require("mysql2/promise")


// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   port: 8889,
//   database: "users",
// })


const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
})

module.exports = db