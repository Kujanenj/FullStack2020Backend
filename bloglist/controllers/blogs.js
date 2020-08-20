const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")











blogsRouter.post("/", async (request, response) => {
  const body = request.body
 
  
  
  const user = await User.findById(request.token.id)
  
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


})

blogsRouter.delete("/:id", async (req,res) => {

  const user = await User.findById(req.body.user)
  const blog = await Blog.findById(req.params.id)
  if(!(user.id.toString() === blog.user.toString())){
    return res.status(401).json({error: "Unauthorized"})
  }
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

  {"_id":{"$oid":"5f3cec83f51555246a7845be"},"blogs":[{"$oid":"5f3cefb695d4392659a5330c"},{"$oid":"5f3cfa64d740342e4562e0cd"}],"username":"test","name":"test","passwordHash":"c3922caaedc8e5d051f7c839df32cc99462da231a045bd892a5ad0b33a7227ce5a7956433b0839e29c4521d0bebe216a272cc99fe5353d1f8502b987e417215e","salt":"d733481c5e447d2167fdc5710d290f70d63053667f51dda79fb8a73e7b9da22a","__v":{"$numberInt":"2"}}
  {"_id":{"$oid":"5f3cefb695d4392659a5330c"},"likes":{"$numberInt":"2"},"title":"TOKENISE","author":"new","url":"String","user":{"$oid":"5f3cec83f51555246a7845be"},"__v":{"$numberInt":"0"}}
*/