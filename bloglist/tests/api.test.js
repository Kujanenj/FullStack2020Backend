const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const helper = require("./test_helper")
const api = supertest(app)
const logger = require("../utils/logger")

beforeEach(async() => {

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)



})
test("simpleGetTest", async() => {
  const response = await api.get("/api/blogs")
  console.log(response)
  expect(response.status).toBe(200)
  expect(response.header["content-type"]).toBe("application/json; charset=utf-8")
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})
test("idExists" , async() => {
  const response = await api.get("/api/blogs")
  response.body.forEach(blog => expect(blog.id).toBeDefined())
})
test("post",async() => {
  const newBlog = {
    title: "new",
    author: "new",
    url: "String",
    likes: 2
  }
  await api.post("/api/blogs").send(newBlog).expect(201).expect("Content-Type", /application\/json/)
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
  const response = await api.post("/api/blogs").send(newBlog)
  expect(response.body.likes).toBe(0)
})
test("noUrlTitle",async() => {
  const newBlog = {
    author: "new",
    likes : 2
  }
  await api.post("/api/blogs").send(newBlog).expect(400)
})

afterAll( async() => {
  mongoose.connection.close()
})