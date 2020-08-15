const app = require("./app") // varsinainen Express-sovellus
const http = require("http")
const config = require("./utils/config")
const logger = require("./utils/logger")

console.log("Trying to do server")
const server = http.createServer(app)


server.listen(config.PORT, () => {
  logger.info(`Serveadadadr running on port ${config.PORT}`)
})