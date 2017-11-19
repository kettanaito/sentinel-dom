describe('Edges', function () {
  /**
   * edgeX
   */
  describe('edgeX', function () {
    it('Open test page', () => {
      cy.openExample('absolute/edges/edge-x.html');
    });

    it('Should resolve: target within the viewport', function () {
      cy.scrollTo(1, 0);
      cy.get('#target-01').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollX < edgeX', function () {
      cy.scrollTo(Cypress.env('targetSize') * 0.2, 0);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollX > edgeX', function () {
      cy.scrollTo(Cypress.config('viewportWidth') + Cypress.env('targetSize') * 0.75, 0);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should resolve: target within the scrollable distance', function () {
      cy.scrollTo(Cypress.config('viewportWidth'), 0);
      cy.get('#target-02').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });
  });

  /**
   * edgeX + offsetX
   */
  describe('edgeX + offsetX', function () {
    it('Open test page', () => cy.openExample('absolute/edges/edge-x-offset-x.html'));

    it('Should resolve: target within the viewport', function () {
      cy.scrollTo(1, 0);
      cy.get('#target-01').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollX < edgeX + offsetX', function () {
      cy.scrollTo(Cypress.env('targetSize') * 0.25, 0);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollX > edgeX + offsetX', function () {
      cy.scrollTo(Cypress.config('viewportWidth') + Cypress.env('targetSize') * 0.75 - 9, 0);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should resolve: target within scrollable distance', function () {
      cy.scrollTo(Cypress.config('viewportWidth'), 0);
      cy.get('#target-02').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });
  });

  /**
   * edgeY
   */
  describe('edgeY', function () {
    it('Open test page', () => cy.openExample('absolute/edges/edge-y.html'));

    it('Should resolve: target within viewport', function () {
      cy.scrollTo(0, 1);
      cy.get('#target-01').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollY < edgeY', function () {
      cy.scrollTo(0, Cypress.env('targetSize') * 0.2);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollY > edgeY', function () {
      cy.scrollTo(0, Cypress.config('viewportHeight') + Cypress.env('targetSize') * 0.75);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should resolve: edgeY is visible', function () {
      cy.scrollTo(0, Cypress.config('viewportHeight'));
      cy.hook(cy.screenshot);
      cy.get('#target-02').should('have.class', Cypress.env('trackedClass'));
    });
  });

  describe('edgeY + offsetY', function () {
    it('Open test page', () => cy.openExample('absolute/edges/edge-y-offset-y.html'));

    it('Should resolve: edgeY + offsetY is visible', function () {
      cy.scrollTo(0, 1);
      cy.get('#target-01').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollY < edgeY + offsetY', function () {
      cy.scrollTo(0, Cypress.env('targetSize') * 0.25);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should reject: scrollY > edgeY + offsetY', function () {
      cy.scrollTo(0, Cypress.config('viewportHeight') + Cypress.env('targetSize') * 0.75);
      cy.get('#target-02').should('not.have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });

    it('Should resolve: edgeY + offsetY is visible', function () {
      cy.scrollTo(0, Cypress.config('viewportHeight') + Cypress.env('targetSize') * 0.25 + 10);
      cy.get('#target-02').should('have.class', Cypress.env('trackedClass'));
      cy.hook(cy.screenshot);
    });
  });

});
