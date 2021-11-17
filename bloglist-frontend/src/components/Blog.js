import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { commentBlog, likeBlog } from '../reducers/blogReducer'


const Blog = ({ blog }) => {
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const _addLike = () => {
    dispatch(likeBlog(blog))
  }

  const _addComment = (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, comment))
    setComment('')
  }

  if (!blog) {
    return null
  }

  return (
    <div className='form'>
      <h2>{blog.title}</h2>
      <Link to={blog.url}>{blog.url}</Link>
      <p>{blog.likes} likes <button className='button' onClick={_addLike}>like</button><br></br>
      added by {blog.user.name}</p>
      <h3>comments</h3>
      <form onSubmit={_addComment}>
        <input className='input' type='text' value={comment} onChange={({ target }) => setComment(target.value)}/>
        <button className='button' type='submit'>add comment</button>
      </form>
      <ul>
        {blog.comments.map((c, index) => <li key={index}>{c}</li>)}
      </ul>
    </div>
  )
}

export default Blog