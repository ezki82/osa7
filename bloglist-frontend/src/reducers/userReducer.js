import loginService from '../services/login'
import blogService from '../services/blogs'
import { setInfoNotification } from './notificationReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return action.data
  case 'RESTORE_USER':
    return action.data
  case 'LOGOUT_USER':
    return null
  default:
    return state
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN_USER',
        data: user
      })
    } catch (error) {
      dispatch(setInfoNotification('wrong credentials', 5))
    }
  }
}

export const restoreUser = (user) => {
  return {
    type: 'RESTORE_USER',
    data: user
  }
}


export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedUser')
    blogService.removeToken()
    dispatch({
      type: 'LOGOUT_USER'
    })
  }
}

export default reducer