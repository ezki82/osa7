describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test Tester',
      username: 'ttes',
      password: 'test123'
    }
    const secondUser = {
      name: 'Cannot Delete',
      username: 'cdel',
      password: 'cannot123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('user can log in with proper credentials', function () {
      cy.visit('http://localhost:3000')
      cy.get('#username').type('ttes')
      cy.get('#password').type('test123')
      cy.get('#login-button').click()

      cy.contains('Test Tester logged in')
    })

    it('user cannot log in with false credentials', function () {
      cy.visit('http://localhost:3000')
      cy.get('#username').type('ffalse')
      cy.get('#password').type('false123')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      // login directly without ui
      cy.login({ username: 'ttes', password: 'test123' })

      // create blog directly without ui
      cy.createBlog({ author: 'Test Tester', title: 'Autocreated Blog #1', url: 'www.autoblog1.com' })
      cy.createBlog({ author: 'Test Tester', title: 'Autocreated Blog #2', url: 'www.autoblog2.com' })
      cy.createBlog({ author: 'Test Tester', title: 'Autocreated Blog #3', url: 'www.autoblog3.com' })
      cy.reload()
    })

    it('A blog can be created', function () {
      cy.contains('create blog').click()
      cy.get('#title').type('Testing')
      cy.get('#author').type('Test Tester')
      cy.get('#url').type('www.testing.org')
      cy.get('#submit').click()
      cy.contains('Testing Test Tester')
    })

    it('A blog can be liked', function(){
      cy.contains('Autocreated Blog #2').parent().as('2ndBlog')
      cy.get('@2ndBlog').contains('show details').click()
      cy.contains('url:www.autoblog2.com').parent().as('2ndBlogShow')
      cy.get('@2ndBlogShow').contains('like').click()
      cy.get('@2ndBlogShow').contains('likes: 1')
    })

    it('A blog can be removed', function(){
      cy.contains('Autocreated Blog #2').parent().as('2ndBlog')
      cy.get('@2ndBlog').contains('show details').click()
      cy.contains('url:www.autoblog2.com').parent().as('2ndBlogShow')
      cy.get('@2ndBlogShow').contains('remove').click()
      cy.contains('Autocreated Blog #2').should('not.exist')
    })

    it('A blog cannot be removed by another user', function(){
      cy.get('#logout-button').click()
      cy.login({ username: 'cdel', password: 'cannot123' })
      cy.contains('Cannot Delete logged in')
      cy.contains('Autocreated Blog #2').parent().as('2ndBlog')
      cy.get('@2ndBlog').contains('show details').click()
      cy.contains('url:www.autoblog2.com').parent().as('2ndBlogShow')
      cy.get('@2ndBlogShow').contains('remove').should('not.exist')
    })

    it('Blogs are ordered according to likes. A blog with most likes is on top', function(){
      cy.contains('Autocreated Blog #3').parent().as('3rdBlog')
      cy.get('@3rdBlog').contains('show details').click()
      cy.contains('url:www.autoblog3.com').parent().as('3rdBlogShow')
      cy.get('@3rdBlogShow').contains('like').click()
      cy.get('@3rdBlogShow').contains('likes: 1')
      cy.get('@3rdBlogShow').contains('like').click()
      cy.get('@3rdBlogShow').contains('likes: 2')
      cy.get('@3rdBlogShow').contains('like').click()
      cy.get('@3rdBlogShow').contains('likes: 3')

      cy.contains('Autocreated Blog #2').parent().as('2ndBlog')
      cy.get('@2ndBlog').contains('show details').click()
      cy.contains('url:www.autoblog2.com').parent().as('2ndBlogShow')
      cy.get('@2ndBlogShow').contains('like').click()
      cy.get('@2ndBlogShow').contains('likes: 1')
      cy.get('@2ndBlogShow').contains('like').click()
      cy.get('@2ndBlogShow').contains('likes: 2')

      cy.contains('Autocreated Blog #1').parent().as('1stBlog')
      cy.get('@1stBlog').contains('show details').click()
      cy.contains('url:www.autoblog1.com').parent().as('1stBlogShow')
      cy.get('@1stBlogShow').contains('like').click()
      cy.get('@1stBlogShow').contains('likes: 1')
      cy.reload()

      cy.get('.blog').then( blogs => {
        cy.wrap(blogs[0]).contains('Autocreated Blog #3')
        cy.wrap(blogs[1]).contains('Autocreated Blog #2')
        cy.wrap(blogs[2]).contains('Autocreated Blog #1')
      })
    })
  })
})