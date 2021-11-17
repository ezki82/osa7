/* eslint-disable no-unused-vars */
const _ = require('lodash')
const { count } = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likesTotal = blogs.reduce((prev, cur) => {
    return prev + cur.likes
  }, 0)
  return likesTotal
}

const favouriteBlog = (blogs) => {
  const blogMostLikes = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
  return blogMostLikes
}

const mostBlogs = (blogs) => {
  const blogsCount = _.countBy(blogs, 'author')
  let arr = []
  for (const [key, value] of Object.entries(blogsCount)) {
    arr.push({
      author: key,
      blogs: value
    })
  }
  const authorMostBlogs = arr.reduce((prev, current) => {
    return (prev.value > current.value) ? prev : current
  })
  return authorMostBlogs
}

const mostLikes = (blogs) => {
  const groupBlogs = _.groupBy(blogs, 'author')
  let authorsLikeCount = []
  for (const [key, value] of Object.entries(groupBlogs)) {
    let likeSum = 0
    for (const [k, v] of Object.entries(value)) {
      likeSum += v.likes
    }
    authorsLikeCount.push({
      author: key,
      likes: likeSum
    })
  }
  const mostLikeCount = authorsLikeCount.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
  return mostLikeCount
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}