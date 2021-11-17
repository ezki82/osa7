import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'LIKE_BLOG':
    return state.map((blog) => blog.id === action.data.id ? action.data : blog )
  case 'REMOVE_BLOG':
    return state.filter(blog => blog.id !== action.data)
  case 'COMMENT_BLOG':
    return state.map((blog) => blog.id === action.data.id ? action.data : blog )
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const commentBlog = (id, addedComment) => {
  return async dispatch => {
    const commentedBlog = await blogService.addComment(id, { comment: addedComment })
    dispatch({
      type: 'COMMENT_BLOG',
      data: commentedBlog
    })
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog.id, likedBlog)
    dispatch({
      type: 'LIKE_BLOG',
      data: likedBlog
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: id
    })
  }
}

export default reducer