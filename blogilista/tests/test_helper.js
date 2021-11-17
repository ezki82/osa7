const Blog = require('../models/blog')
const user = require('../models/user')

const initialBlogs = [
  {
    author: 'Esko Mörkö',
    title: 'Eskon seikkailut',
    url: 'www.esko.com',
    likes: 0
  },
  {
    author: 'Aku Ankka',
    title: 'Akun anagrammit',
    url: 'www.donald.com',
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    author: 'R. Emove',
    title: 'This will be removed',
    url: 'www.remove.com'
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await user.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}