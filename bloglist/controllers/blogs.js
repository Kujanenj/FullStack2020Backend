const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post("/", async (request, response,next) => {
  const body = request.body
  const user = await User.findById(body.user)

  try {
    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user : user._id
    })
    const savedBlog = await newBlog.save()

    user.blogs=user.blogs.concat(savedBlog._id)

    await(user.save())

    response.status(201).json(savedBlog)

  } catch (error) {
    next(error)
  }
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


/*{
    "title": "trying to add user",
    "author": "new",
    "url": "String",
    "likes": "2",
		"user" : "5f3cd51e4450100e80dc2f32"
  }

*/