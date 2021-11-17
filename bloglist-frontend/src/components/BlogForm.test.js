import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm/>', () => {
  let component

  const createBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <BlogForm createBlog={createBlog}/>
    )
  })

  test('renders content', () => {
    const inputAuthor = component.container.querySelector('#author')
    const inputTitle = component.container.querySelector('#title')
    const inputUrl = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(inputTitle, {
      target: { value: 'Great Authors Blog' }
    })
    fireEvent.change(inputAuthor, {
      target: { value: 'Great Author' }
    })
    fireEvent.change(inputUrl, {
      target: { value: 'www.gab.com' }
    })
    fireEvent.submit(form)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({ title: 'Great Authors Blog', author: 'Great Author', url: 'www.gab.com' })
  })
})
