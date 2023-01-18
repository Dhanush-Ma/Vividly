const express = require('express')
const winston = require('winston')
const app = express()

require("./start/log")()
require("./start/routes")(app)
require("./start/prod")(app)
require("./start/db")()
require("./start/config")

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    winston.info(`Listening on ${PORT}`)
})

module.exports = server