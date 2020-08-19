const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post("/", async (request, response,next) => {
  const user = await User.find({ id: request.body.userid })
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
  
})
blogsRouter.delete("/:id", async (req,res) => {
  await Blog.deleteOne({ _id: req.params.id })
  res.status(204).end()
})
blogsRouter.put("/:id", async (req,res) => {
  const newBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  }
  await Blog.updateOne({ _id : req.params.id },newBlog)
  res.status(200).json(newBlog)
})

module.exports = blogsRouter