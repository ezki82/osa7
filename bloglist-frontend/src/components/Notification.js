import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification === '') {
    return (
      <div>
      </div>
    )
  } else {
    return(
      <div>
        {notification}
      </div>
    )
  }
}

export default Notification