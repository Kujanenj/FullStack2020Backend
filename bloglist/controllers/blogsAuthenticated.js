const blogsAuthenticatedRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const logger = require("../utils/logger")
blogsAuthenticatedRouter.post("/", async (request, response) => {
  const body = request.body



  const user = await User.findById(request.token.id)

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await (user.save())

  response.status(201).json(savedBlog)


})

blogsAuthenticatedRouter.delete("/:id", async (req, res) => {
  
  const user = await User.findById(req.token.id)
  const blog = await Blog.findById(req.params.id)
  if (!(user.id.toString() === blog.user.toString())) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  await Blog.deleteOne({ _id: req.params.id })
  res.status(204).end()
})
blogsAuthenticatedRouter.put("/:id", async (req, res) => {
  const newBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  }
  await Blog.updateOne({ _id: req.params.id }, newBlog)
  res.status(200).json({ ...newBlog,id:req.params.id })
})

module.exports = blogsAuthenticatedRouter

