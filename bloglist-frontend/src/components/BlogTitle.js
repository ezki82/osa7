import React from 'react'
import { Link } from 'react-router-dom'
const BlogTitle = ({ blog }) => {


  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 3
  }

  return (
    <div style={blogStyle} className='blog'>
      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
    </div>
  )
}

export default BlogTitle
