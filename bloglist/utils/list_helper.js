
const dummy =(blogs) => {
  return 1
}
const totalLikes =(blogs) => {
  return blogs.reduce((total,blog) => {return total+blog.likes},0)
}

const favouriteBlog=(blogs) => {
  var favourite=blogs[0]
  blogs.forEach(blog => {
    if(blog.likes > favourite.likes){
      favourite = blog
    }
  }
  )
  return favourite

}
module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
