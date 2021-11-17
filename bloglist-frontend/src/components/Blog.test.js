import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog/>', () => {
  let component
  const blog = {
    title: 'Test blog',
    author: 'Test Tester',
    url: 'www.test.com',
    likes: 0,
    user: {
      name: 'Test Tester',
      username: 'ttes'
    }
  }
  const user = {
    username: 'ttes'
  }
  const addLike = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} addLike={addLike}/>
    )
  })

  test('renders content', () => {
    expect(component.container).toHaveTextContent('Test blog')
  })

  test('url and likes are not rendered', () => {
    const div = component.container.querySelector('.showDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('url and likes ares shown after button is pressed', () => {
    const button = component.getByText('show details')
    fireEvent.click(button)

    const div = component.container.querySelector('.showDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('function is called twice after two like clicks', () => {

    const showDetailsButton = component.getByText('show details')
    fireEvent.click(showDetailsButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(addLike.mock.calls).toHaveLength(2)
  })
})
