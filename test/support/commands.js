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

import { Tracker } from '../../lib';

Cypress.Commands.add('hook', function (command, force = false) {
  if (force || Cypress.env('debug')) command();
});

Cypress.Commands.add('openExample', function (filePath) {
  cy.visit(`./examples/${filePath}`);
});

/**
 * Create target element on the page.
 */
Cypress.Commands.add('createTarget', function (styles = {}, parentNode) {
  cy.window().then(({ document }) => {
    const target = document.createElement('div');
    target.classList.add('target');

    /* Append provided styles */
    Object.keys(styles).forEach((styleRule) => {
      target.style[styleRule] = styles[styleRule];
    });

    /* Append target element to its parent */
    const parent = parentNode || document.body;
    parent.appendChild(target);

    return target;
  });
});

function snapshotCallback({ DOMElement }) {
  DOMElement.classList.add('tracked');
}

Cypress.Commands.add('createTracker', function (optionsGetter) {
  cy.window().then((window) => {
    const { document } = window;

    /* Pre-get targets, convert to array */
    const targets = Array.from(document.getElementsByClassName('target'));

    /* Compose options Object */
    const trackerOptions = optionsGetter({
      document,
      targets,
      callback: snapshotCallback
    });

    /* Create a new instance of Tracker */
    const tracker = new Tracker(Object.assign({}, {
      window: {
        top: window.scrollY,
        left: window.scrollX,
        height: window.innerHeight,
        width: window.innerWidth
      }
    }, trackerOptions));

    window.__sentinel_tracker__ = tracker;

    return tracker;
  });
});
