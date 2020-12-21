const crypto = require("crypto")
const usersRouter = require("express").Router()
const User = require("../models/user")

const logger = require("../utils/logger")


usersRouter.post("/", async (request, response,next) => {
  const body = request.body
  if(body.password.length<3){
    return response.status(400).json({ error:"Password too short" })
  }
  const newSalt = crypto.randomBytes(32).toString("hex")
  const passwordHash =  crypto.scryptSync(body.password,newSalt,64).toString("hex")

  try {
    const user = new User({
      username: body.username,
      name : body.name,
      passwordHash,
      salt: newSalt
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }


})
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs')
 logger.info("Usersss") 
  response.json(users.map(u => u.toJSON()))
})
module.exports = usersRouter