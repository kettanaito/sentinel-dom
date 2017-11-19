import fs from 'fs';
import { Tracker } from '../../lib';

/* Constants */
const container = document.getElementById('container');
const bounds = document.getElementById('bounds');
const targetSize = 200;
const targetSelector = document.getElementsByClassName('target');

function createTarget(styles = {}, parent = container) {
  const element = document.createElement('div');
  element.classList.add('target');

  /* Set target's dimensions */
  element.style.height = `${targetSize}px`;
  element.style.width = `${targetSize}px`;

  /* Append style rules dynamically */
  Object.keys(styles).forEach(rule => element.style[rule] = styles[rule]);

  parent.appendChild(element);
  return element;
}

describe('Basics', () => {
  it('Library exports are fine', () => {
    expect(Tracker).to.not.be.undefined;
  });
});

require('./Tracker/index.test');
