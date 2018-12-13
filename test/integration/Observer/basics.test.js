describe('Basics', function() {
  it('Tracks dynamically created targets', function() {
    cy.openExample('./basics/dynamic-targets.html')
    cy.createTarget('target-01')
    cy.createTarget('target-02')

    cy.scrollTo(1, 1)

    cy.get('#target-01').should('have.class', Cypress.env('trackedClass'))
    cy.get('#target-02').should('have.class', Cypress.env('trackedClass'))
  })
})
