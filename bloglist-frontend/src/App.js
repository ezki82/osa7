import React, { useEffect } from 'react'
import { Link, Route, Switch, useRouteMatch, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { logoutUser, restoreUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/allUsersReducer'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import User from './components/User'
import Users from './components/Users'
import Blog from './components/Blog'

const App = () => {

  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const allUsers = useSelector(state => state.allUsers)
  const allBlogs = useSelector(state => state.blog)

  // Match id parameter to corresponding user
  const u_match = useRouteMatch('/users/:id')
  const userMatch = u_match ? allUsers.find(user => user.id === u_match.params.id) : null

  // Match id parameter to corresponding blog
  const b_match = useRouteMatch('/blogs/:id')
  const blogMatch = b_match ? allBlogs.find(blog => blog.id === b_match.params.id) : null

  useEffect(() => {

    // Init bloglist
    dispatch(initializeBlogs())

    // Init all users
    dispatch(initializeUsers())

    // Get userinfo from local storage
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(restoreUser(user))
    }
  }, [])

  // Logout user and redirect to root
  const _logoutUser = () => {
    dispatch(logoutUser())
    history.push('/')
  }

  return (
    <div>
      <div>
        <Notification />
        {user === null ?
          <LoginForm /> :
          <div className='navbar'>
            <Link className='link' to="/users">users</Link>
            <Link className='link' to="/blogs">blogs</Link> {user.name} logged in <button onClick={_logoutUser}>logout</button>
          </div>}
      </div>
      <Switch>
        <Route path='/users/:id'>
          <User user={userMatch} />
        </Route>
        <Route path='/users'>
          <Users />
        </Route>
        <Route path='/blogs/:id'>
          <Blog blog={blogMatch} />
        </Route>
        <Route path='/blogs'>
          <Blogs />
          <BlogForm />
        </Route>
      </Switch>
    </div>
  )
}

export default App