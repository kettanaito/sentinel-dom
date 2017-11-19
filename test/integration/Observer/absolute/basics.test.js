export default describe('Basics', function () {
  it('Open test page', () => {
    cy.visit('examples/absolute/basics.html');
  });

  it('Should resolve: target within the viewport', function () {
    cy.scrollTo(1, 1);
    cy.get('#target-01').should('have.class', 'tracked');
    cy.get('#target-02').should('not.have.class', 'tracked');
  });

  it('Should reject: target is not visible', function () {
    cy.scrollTo(20, 20);
    cy.get('#target-02').should('not.have.class', 'tracked');
  });

  it('Should resolve: target within scrollable distance', function () {
    cy.scrollTo(1000, 0);
    cy.get('#target-02').should('have.class', 'tracked');
  });
});
