import React, { useState, useRef } from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setInfoNotification } from '../reducers/notificationReducer'

const BlogForm = () => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    const blogObject = { title, author, url }
    dispatch(createBlog(blogObject))
    dispatch(setInfoNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`, 5))
    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <Togglable buttonLabel='create blog' ref={blogFormRef}>
      <form onSubmit={addBlog}>
        <h2>Create new blog</h2>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={handleUrlChange}
          />
        </div>
        <button id="submit" className='button' type="submit">create</button>
      </form>
    </Togglable>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func
}

export default BlogForm