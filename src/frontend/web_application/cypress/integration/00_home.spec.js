describe('Home', () => {
  describe('Authentication', () => {
    it('Log in', () => {
      cy.visit('/');
      cy.url().should('contains', '/auth/signin');
      cy.get('input[name=username]').type('dev');
      cy.get('input[name=password]').type('123456');
      cy.contains('Login').click();
      cy.url().should('not.contains', '/auth/signin');
    });
  });
});
