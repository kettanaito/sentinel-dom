const { Tracker } = Sentinel;

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

function clearChildren(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

function scroll(nextX, nextY) {
  return new Promise((resolve) => {
    window.scrollTo(nextX, nextY);
    setTimeout(resolve, 30);
  });
}

function beforeEachHook() {
}

function cleanUp() {
  /* Flush the containers' content */
  clearChildren(container);
  clearChildren(bounds);

  /* Restore scroll position before each test */
  window.scrollTo(0, 0);
}

function addObserver(observer) {
  window.observer = observer;
}

/**
 * Flush tracking observer.
 * Each test scenario group declares its own Observer. Therefore, the latter
 * should be flashed after each test group to prevent settings overlapping.
 */
function flushObserver() {
  window.observer = null;
}

/**
 * Animate the tracked DOM element.
 * Used mainly for snapshot resolve callback to portray the
 * tracking status of the element in the browser.
 */
function animate(DOMElement) {
  DOMElement.classList.add('tracked');
}

require([
  // './test/basics.test',
  // './test/once.test',

  /* Absolute tracking */
  './test/absolute/basics.test',
  './test/absolute/edges.test',
  './test/absolute/thresholds.test',

  /* Relative tracking */
  // './test/relative/thresholds.test'
], mocha.run);
