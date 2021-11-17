import React from 'react'
import { useSelector } from 'react-redux'
import BlogTitle from './BlogTitle'

const Blogs = () => {
  const blogs = useSelector(state => state.blog)
  return (
    <div className='form'>
      <h2>Blogs</h2>
      {blogs.map(blog => <BlogTitle key={blog.id} blog={blog}/>)}
    </div>
  )
}

export default Blogs