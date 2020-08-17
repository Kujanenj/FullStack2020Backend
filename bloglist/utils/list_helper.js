const dash = require("lodash")
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
const mostBlogs = (blogs) => {


  const tally = dash.reduce(blogs, (total, next) => {

    total[next.author] = (total[next.author] || 0) + 1

    return total
  }, {})
  var author = Object.keys(tally).reduce(function(a, b){ return tally[a] > tally[b] ? a : b })
  return {
    "author" : author,
    "blogs" : tally[author]
  }

}
const mostLikes = (blogs) => {
  var output =
  dash(blogs)
    .groupBy("author")
    .map((objs, key) => ({
      "author": key,
      "likes": dash.sumBy(objs, "likes") }))
    .value()
  return(dash.maxBy(output,"likes"))

}
module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
