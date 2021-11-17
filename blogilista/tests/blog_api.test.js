const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('tests with initialnotes saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('first blogs author is Esko Mörkö', async () => {
    const response = await api.get('/api/blogs')

    const author = response.body.map(b => b.author)
    expect(author).toContain('Esko Mörkö')
  })

  test('returned blog identifier name is id', async () => {
    const response = await api.get('/api/blogs')

    const firstBlog = response.body[0]
    expect(firstBlog.id).toBeDefined()
  })
})

describe('tests with blog post', () => {

  beforeAll(async () => {
    await User.deleteMany({})
    const newUser = {
      username: 'ttes',
      name: 'Test Tester',
      password: 'test123'
    }

    await api
      .post('/api/users')
      .send(newUser)
  })

  test('post blog and check it is saved to database', async () => {

    const user = {
      username: 'ttes',
      password: 'test123'
    }

    const userResponse = await api
      .post('/login')
      .send(user)
      .expect(200)

    const newBlog = {
      author: 'Jest Tester',
      title: 'The art of testing',
      url: 'www.test.com',
      likes: 999
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userResponse.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(newBlog.title)
  })

  test('post blog without likes. Amount of likes should be 0 in database', async () => {
    const user = {
      username: 'ttes',
      password: 'test123'
    }

    const userResponse = await api
      .post('/login')
      .send(user)
      .expect(200)

    const newBlogWithoutLikes = {
      author: 'Sad McSadFace',
      title: 'Nobody likes me',
      url: 'www.sad.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userResponse.body.token)
      .send(newBlogWithoutLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const savedBlog = response.body.filter(r => r.author === 'Sad McSadFace')
    expect(savedBlog[0].likes).toBe(0)
  })

  test('post blog without title and url. Returned statuscode should be 400', async () => {
    const user = {
      username: 'ttes',
      password: 'test123'
    }

    const userResponse = await api
      .post('/login')
      .send(user)
      .expect(200)

    const newEmptyBlog = {
      author: 'Edgar Empty'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userResponse.body.token)
      .send(newEmptyBlog)
      .expect(400)
  })
})

describe('tests with put blog', () => {

  test('post blog and update it. Check that update is completerd', async () => {
    const user = {
      username: 'ttes',
      password: 'test123'
    }

    const userResponse = await api
      .post('/login')
      .send(user)
      .expect(200)

    const newBlog = {
      author: 'Chang E. Blog',
      title: 'Only change is permanent',
      url: 'www.chan.ge'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userResponse.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAfterPost = response.body
    const savedBlog = blogsAfterPost.filter(r => r.author === newBlog.author)
    expect(savedBlog[0].title).toBe(newBlog.title)

    const changedBlog = {
      author: 'Matti Muutos',
      title: 'Vain muutos on pysyvää',
      url: 'www.muutos.com'
    }

    await api
      .put(`/api/blogs/${savedBlog[0].id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const changeResponse = await api.get('/api/blogs')
    const blogsAfterChange = changeResponse.body
    const updatedBlog = blogsAfterChange.filter(r => r.id === savedBlog[0].id)
    expect(updatedBlog[0].title).toBe(changedBlog.title)
  })
})

describe('tests with delete blog', () => {

  test('post blog and delete it and check that deletion is completed', async () => {
    const user = {
      username: 'ttes',
      password: 'test123'
    }

    const userResponse = await api
      .post('/login')
      .send(user)
      .expect(200)

    const newBlog = {
      author: 'Del Delete',
      title: 'This one will be deleted',
      url: 'www.del.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userResponse.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAfterPost = response.body
    const savedBlog = blogsAfterPost.filter(r => r.author === newBlog.author)
    expect(savedBlog[0].title).toBe(newBlog.title)

    await api
      .delete(`/api/blogs/${savedBlog[0].id}`)
      .set('Authorization', 'bearer ' + userResponse.body.token)
      .expect(204)

    const responseAfterDelete = await api.get('/api/blogs')
    expect(responseAfterDelete.body).toHaveLength(blogsAfterPost.length - 1)

  })
})

afterAll(() => {
  mongoose.connection.close()
})