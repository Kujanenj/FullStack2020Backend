const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
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

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
  userForToken["username"]="test"
  const users = await helper.usersInDb()
  userForToken["id"]=users[0].id
  testToken = jwt.sign(userForToken, process.env.SECRET)
  
})
test("simpleGetTest", async() => {
  const response =  await api.get("/api/blogs").set('Authorization',"Bearer "+testToken)
  expect(response.status).toBe(200)
  expect(response.header["content-type"]).toBe("application/json; charset=utf-8")
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})
test("idExists" , async() => {
  const response = await api.get("/api/blogs").set('Authorization',"Bearer "+testToken)
  response.body.forEach(blog => expect(blog.id).toBeDefined())
})
test("Bpost",async() => {
  const users = await helper.usersInDb()
  const newBlog = {
    title: "new",
    author: "new",
    url: "String",
    likes: 2,
    user : users[0].id
  }
  const response = await api.post("/api/blogs").send(newBlog).set('Authorization',"Bearer "+testToken)
  expect(response.status).toBe(201)
  const blogsAtEnd = await helper.blogsInDb()
  logger.info(blogsAtEnd)
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length+1)



})
test("noLikes",async() => {
  const newBlog = {
    title: "noLikes",
    author: "new",
    url: "String"
  }
  const response = await api.post("/api/blogs").set('Authorization',"Bearer "+testToken).send(newBlog)
  expect(response.body.likes).toBe(0)
})
test("noUrlTitle",async() => {
  const newBlog = {
    author: "new",
    likes : 2
  }
  await api.post("/api/blogs").set('Authorization',"Bearer "+testToken).send(newBlog).expect(400)
})

afterAll( async() => {
  mongoose.connection.close()
})