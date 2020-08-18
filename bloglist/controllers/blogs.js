const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post("/", async (request, response,next) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch(error => next(error))

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