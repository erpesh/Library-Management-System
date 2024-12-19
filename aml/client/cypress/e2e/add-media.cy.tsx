describe('Add Media Form', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login() // Custom command to log in
    cy.visit('/media/add')
  })

  it('should load the add media form', () => {
    cy.get('form').should('exist')
    cy.contains('Add New Media').should('be.visible')
  })

  it('should fill out the form for a book and submit successfully', () => {
    cy.get('input[name="title"]').type('Test Book')
    
    // Select media type
    cy.get('button[id="mediaType"]').click()
    cy.get('[role="option"]').contains('Book').click()
    
    // Select genre
    cy.get('button[id="genre"]').click()
    cy.get('[role="option"]').contains('Fiction').click() // Assuming 'Fiction' is a valid genre for books
    
    cy.get('input[name="author"]').type('Test Author')
    cy.get('textarea[name="description"]').type('This is a test book description')
    cy.get('input[name="imageUrl"]').type('https://example.com/test-book-cover.jpg')
    cy.get('input[name="stock"]').type('10')

    cy.intercept('POST', '/api/media').as('addMedia')
    cy.get('button[type="submit"]').click()

    cy.wait('@addMedia').its('response.statusCode').should('eq', 200)
    cy.contains('Media Added').should('be.visible')
  })

  it('should show validation errors for empty required fields', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('Title is required').should('be.visible')
    cy.contains('Description must be at least 10 characters').should('be.visible')
    cy.contains('Genre is required').should('be.visible')
  })

  it('should change form fields based on media type selection', () => {
    // Select 'Book'
    cy.get('button[id="mediaType"]').click()
    cy.get('[role="option"]').contains('Book').click()
    cy.get('input[name="author"]').should('exist')

    // Select 'CD'
    cy.get('button[id="mediaType"]').click()
    cy.get('[role="option"]').contains('CD').click()
    cy.get('input[name="artist"]').should('exist')

    // Select 'Game'
    cy.get('button[id="mediaType"]').click()
    cy.get('[role="option"]').contains('Game').click()
    cy.get('input[name="platform"]').should('exist')
    cy.get('input[name="publisher"]').should('exist')
  })
})

