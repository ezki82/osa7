const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('root123', 10)
  const user = new User({
    username: 'root',
    passwordHash
  })
  await user.save()
})

describe('create user tests when 1 initial user is in db', () => {
    

  test('create new user with new username to db succeeds', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'esal',
      name: 'Esa Salminen',
      password: 'esa123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('cannot create new user with existing username ', async () => {
    const newUser = {
      username: 'esal',
      name: 'Esko Salminen',
      password: 'esko123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('`username` to be unique')
  })

  test('cannot create new user with too short username ', async () => {
    const newUser = {
      username: 'es',
      name: 'Esko Salminen',
      password: 'esko123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('shorter than the minimum allowed length')
  })

  test('cannot create new user without username ', async () => {
    const newUser = {
      name: 'Esko Salminen',
      password: 'esko123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('`username` is required')
  })

  test('cannot create new user without password ', async () => {
    const newUser = {
      username: 'esal',
      name: 'Esko Salminen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('password missing')
  })
})

afterAll(() => {
  mongoose.connection.close()
})