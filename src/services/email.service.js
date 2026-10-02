const path = require("path")
const fs = require("fs")
const transporter = require("../../config/mail")
const Handlebars = require("handlebars")

const sendEmail = async (email, subject, fileName, data) => {
  try {
    const templatePath = path.join(__dirname, `../views/${fileName}.hbs`)

    const templateFiles = fs.readFileSync(templatePath, "utf-8")

    const template = Handlebars.compile(templateFiles)

    const html = template(data)

    const message = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: subject,
      html: html,
    }

    await transporter.sendMail(message)
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendEmail
