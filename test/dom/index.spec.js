const { Tracker } = Sentinel;

const targetSize = 200;
const container = document.getElementById('container');

function createTarget(id) {
  const element = document.createElement('div');
  element.classList.add('target');
  if (id) element.id = id;

  element.style.height = `${targetSize}px`;
  element.style.width = `${targetSize}px`;

  container.appendChild(element);
  return element;
}

function scroll(nextX, nextY) {
  return new Promise((resolve) => {
    window.scrollTo(nextX, nextY);
    setTimeout(resolve, 20);
  });
}

function beforeEachHook() {
  window.scrollTo(0, 0);
}

function afterEachHook() {
  container.innerHTML = '';
}

function animate(DOMElement) {
  DOMElement.classList.add('tracked');
}

require([
  'test/basic.spec',
  'test/edges.spec',
  'test/thresholds.spec'
], () => mocha.run());
