/**
 * GitHub issue: https://github.com/kettanaito/sentinel-dom/issues/5.
 */
it('Wrong dimensions comparison due to missing rounding', function() {
  cy.openBugScenario('./dimensions-rounding')
  cy.viewport(990, 500)

  cy.scrollTo(0, 10)
  cy.get('#target-01').should('not.have.class', Cypress.env('trackedClass'))

  cy.scrollTo(0, 100)
  cy.get('#target-01').should('have.class', Cypress.env('trackedClass'))
})
