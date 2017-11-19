describe('Edges', function () {
  before(cy.flushTracker);

  describe('edgeX', function () {
    it('Open test page', () => {
      cy.openExample('absolute/edges/edge-x.html');
    });

    it('Should resolve: target within the viewport', function () {
      cy.scrollTo(1, 0);
      cy.get('#target-01').should('have.class', Cypress.env('trackedClass'));
    });

    it('Should reject: scrollX < edgeX', function () {
      cy.scrollTo(Cypress.env('targetSize') * 0.2, 0);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
    });

    it('Should reject: scrollX > edgeX', function () {
      cy.scrollTo(Cypress.env('targetSize') * 0.75, 0);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
    });

    it('Should resolve: target within the scrollable distance', function () {
      cy.scrollTo(Cypress.config('viewportWidth'), 0);
      cy.get('#target-02').should('have.class', Cypress.env('trackedClass'));
    });
  });

});
