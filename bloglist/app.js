const config = require("./utils/config.js")
const express = require("express")
require('express-async-errors')
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")

const blogsRouter = require("./controllers/blogs")
const blogsAuthenticatedRouter = require("./controllers/blogsAuthenticated")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")


logger.info("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => {
  logger.info("connected to MongoDB")
})
.catch((error) => {
  logger.error("error connection to MongoDB:", error.message)
})

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)
app.use("/api/login", loginRouter)
app.use("/api/blogs", blogsRouter)
if (process.env.NODE_ENV === 'test') {
  console.log("We be in test")
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use("/api/users", usersRouter)
app.use(middleware.tokenExtractor)
app.use("/api/blogs", blogsAuthenticatedRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
