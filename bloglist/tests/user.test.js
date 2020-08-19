const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require("../models/user")
const helper = require("./test_helper")
const api = supertest(app)
const logger = require("../utils/logger")
const jwt = require("jsonwebtoken")
let userForToken = {
  username: "user.username",
  id: "empty",
}

let testToken // = jwt.sign(userForToken, process.env.SECRET)



beforeEach(async() => {

  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
  userForToken["username"]="test"
  const users = await helper.usersInDb()
  userForToken["id"]=users[0].id
  testToken = jwt.sign(userForToken, process.env.SECRET)
})

test("simpleUserGetTest", async() => {
  const response = await api.get("/api/users").set('Authorization',"Bearer "+testToken)
  logger.info(response.body)

  expect(response.status).toBe(200)
  expect(response.header["content-type"]).toBe("application/json; charset=utf-8")
  expect(response.body).toHaveLength(helper.initialUsers.length)
})
test("userPost",async() => {
  const newuser = { "username":"Test313i",
    "name":"nim13ii",
    "password":"SuperSek13red" }

  await api.post("/api/users").send(newuser).set('Authorization',"Bearer "+testToken).expect(201).expect("Content-Type", /application\/json/)
  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(helper.initialUsers.length+1)

})
test("invalidUsername",async() => {
  const newuser = { "username":"12",
    "name":"nim13ii",
    "password":"SuperSek13red" }
  await api.post("/api/users").send(newuser).set('Authorization',"Bearer "+testToken).expect(400).expect("Content-Type", /application\/json/)
  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(helper.initialUsers.length)
})
test("invalidPassword",async() => {
  const newuser = { "username":"1233",
    "name":"nim13ii",
    "password":"Su" }
  await api.post("/api/users").send(newuser).set('Authorization',"Bearer "+testToken).expect(400).expect("Content-Type", /application\/json/)
  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(helper.initialUsers.length)
})

afterAll( async() => {
  mongoose.connection.close()
})