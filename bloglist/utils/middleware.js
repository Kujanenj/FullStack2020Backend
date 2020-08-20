const logger = require("./logger")
const jwt = require("jsonwebtoken")

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("Header:", request.header)
  logger.info("---")
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" })}

  next(error)
}
const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")){
    return authorization.substring(7)
  }
  return null
}
const tokenExtractor =(request,response,next) => {

  logger.info(request.path , request.method)
  
  const token = getTokenFrom(request)
  const decodedToken= jwt.verify(token,process.env.SECRET)
  if(!token || !decodedToken.id){
    logger.info("Invalid token")
    
    next(new Error("JsonWebToken"))
  }
  logger.info("Token was valid")
  request["token"]=decodedToken
  next()
}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}