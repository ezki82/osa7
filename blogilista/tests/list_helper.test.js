/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const list_helper = require('../utils/list_helper')
const emptyBlogs = []
const manyBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('dummy tests', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = list_helper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = list_helper.totalLikes(emptyBlogs)
    expect(result).toBe(0)
  })

  test('of filled list is 36', () => {
    const result = list_helper.totalLikes(manyBlogs)
    expect(result).toBe(36)
  })
})

describe('return', () => {

  test('blog with most likes', () => {
    const result = list_helper.favouriteBlog(manyBlogs)
    const expectBlog = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
    expect(result).toEqual(expectBlog)
  })

  test('author with most blogs', () => {
    const result = list_helper.mostBlogs(manyBlogs)
    const expectResult = {
      author: "Robert C. Martin",
      blogs: 3
    }
    expect(result).toEqual(expectResult)
  })

  test('author with most likes', () => {
    const result = list_helper.mostLikes(manyBlogs)
    const expectResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    expect(result).toEqual(expectResult)
  }) 
})


