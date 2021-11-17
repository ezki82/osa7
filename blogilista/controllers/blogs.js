/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token
  const user = request.user

  if(!token) {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const changedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(changedBlog)
  } catch (exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = request.token

  if(!token) {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  try {  
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(400).json({ error: 'blog not found' })
    if (!(blog.user.toString() === token.id)) {
      return response.status(400).json({ error: 'token does not match to blog creator'})
    }
    blog.remove()
    return response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const comment = request.body.comment
  
  if (!blog) return response.status(400).json({ error: 'blog not found' })
  blog.comments = blog.comments.concat(comment)
  responseBlog = await blog.save()
  return response.json(responseBlog)
})

module.exports = blogsRouter