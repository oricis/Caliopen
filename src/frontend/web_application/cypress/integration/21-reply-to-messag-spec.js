describe('Reply to message -', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Sends a draft', () => {
    const text1 = 'yes I am!';
    cy.get('.s-timeline .s-discussion-item').should('be.visible');
    cy.get('.s-discussion-item__message_excerpt').contains('Fry! Stay back! He\'s too powerful!').click();
    cy.log('write msg');
    cy.get('.m-draft-message-quick__input').type(text1);
    cy.get('.m-draft-message-quick__input').invoke('val').should('equal', text1);
    cy.get('.m-draft-message-quick__send-button[title="Send"]').click();
    cy.get('.m-draft-message-quick__send-button[title="Send"] .m-spinner__icon').should('be.visible');
    cy.get('.m-draft-message-quick__send-button[title="Send"] .m-spinner__icon').should('be.not.visible');
    cy.get('.m-draft-message-quick__input').invoke('val').should('equal', '');
    cy.get('article').contains(text1).should('be.visible');
  });
});
