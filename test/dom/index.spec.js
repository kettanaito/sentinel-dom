const { Tracker } = Sentinel;

/* Constants */
const targetSize = 200;
const container = document.getElementById('container');
const bounds = document.getElementById('bounds');

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

function scroll(nextX, nextY) {
  return new Promise((resolve) => {
    window.scrollTo(nextX, nextY);
    setTimeout(resolve, 20);
  });
}

function beforeEachHook() {
  /* Restore scroll position before each test */
  window.scrollTo(0, 0);
}

function afterEachHook() {
  /* Clean up the containers after each test */
  container.innerHTML = '';
  bounds.innerHTML = '';
}

function animate(DOMElement) {
  DOMElement.classList.add('tracked');
}

require([
  'test/basics.spec',
  'test/edges.spec',
  'test/thresholds.spec',
  'test/once.spec',
], mocha.run);
