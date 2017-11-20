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

import { Observer } from '../../lib';

/**
 * Shorthand command which executes the given function
 * only once the proper flag is set within Cypress process.
 */
Cypress.Commands.add('hook', function (command, force = false) {
  if (force || Cypress.env('debug')) command();
});

/**
 * Shorthand command to open an example HTML file.
 */
Cypress.Commands.add('openExample', function (filePath) {
  cy.visit(`./examples/${filePath}`);
});

/**
 * Shorthand command to open a bug scenario.
 * Useful for bugfix tests.
 */
Cypress.Commands.add('openBugScenario', function (filePath) {
  cy.visit(`./test/integration/bugfixes/${filePath}`);
});

function snapshotCallback({ DOMElement }) {
  DOMElement.classList.add('tracked');
}
