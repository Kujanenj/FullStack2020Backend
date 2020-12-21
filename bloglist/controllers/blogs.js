const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const logger = require("../utils/logger")


blogsRouter.get("/", async (request, response) => {
    
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

module.exports = blogsRouter

