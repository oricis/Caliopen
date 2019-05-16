// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
  cy.url().then((url) => {
    cy.log({ url });
    if (!url.includes('/auth/signin')) {
      cy.visit('/auth/signin');
    }
    cy.get('input[name=username]').type(username || 'dev');
    cy.get('input[name=password]').type(password || '123456');
    cy.contains('Login').click();
    cy.get('.m-item-link[title="Timeline"]').click();
  });
})
