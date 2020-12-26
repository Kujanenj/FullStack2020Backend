const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  console.log("resetting")
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})
router.get('/reset', async (request, response) => {
  console.log("Getting reset")

  response.status(204).end()
})


module.exports = router