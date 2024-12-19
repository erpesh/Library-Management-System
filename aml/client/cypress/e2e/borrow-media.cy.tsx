import { addDays, format } from 'date-fns'

const mediaId = '674886675c0a4a864b8a34d9' // Replace with the actual media ID
const mediaId2 = '6748834e5c0a4a864b8a34bb'

describe('BorrowButton Component', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login() // Custom command to log in
  })

  it('should borrow a media for tomorrow', () => {
    cy.visit(`/media/${mediaId}`)

    // Click the "Borrow Now" button to open the dialog
    cy.get('button[name="borrow"]').click()

    // Check if the dialog is open
    cy.get('div[role="dialog"]').should('be.visible')

    // Open the date picker
    cy.get('button[name="date"]').click()

    // Get the current date
    const currentDay = (new Date()).getDate() + 1

    // Select currentDay
    cy.get('button').contains(currentDay.toString()).click()

    cy.get('body').type('{esc}')

    // Submit the form
    cy.get('button[type="submit"]').contains('Confirm Borrowing').click()

    // Intercept the API call
    cy.intercept('POST', `/api/media/${mediaId}/borrow`).as('borrowItem')

    // Check for success toast
    cy.contains('Successfully borrowed the item').should('be.visible')

    // Verify that the dialog is closed
    cy.get('div[role="dialog"]').should('not.exist')
  })

  it('should show an error when trying to borrow without selecting a date', () => {
    cy.visit(`/media/${mediaId2}`)
    // Click the "Borrow Now" button to open the dialog
    cy.get('button[name="borrow"]').click()

    // Submit the form without selecting a date
    cy.get('button[type="submit"]').contains('Confirm Borrowing').click()

    // Check for the error message
    cy.contains('A return date is required.').should('be.visible')
  })

  it('should close the dialog when clicking the cancel button', () => {
    cy.visit(`/media/${mediaId2}`)
    // Click the "Borrow Now" button to open the dialog
    cy.get('button[name="borrow"]').click()

    // Click the cancel button
    cy.get('button[type="button"]').contains('Cancel').click()

    // Verify that the dialog is closed
    cy.get('div[role="dialog"]').should('not.exist')
  })
})

