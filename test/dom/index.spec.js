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
    setTimeout(resolve, 15);
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

describe('Absolute tracking', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);
  after(() => window.scrollTo(0, 0));

  it('Basics', async () => {
    let poolCopy = {};
    const targetOne = createTarget();
    const targetTwo = createTarget();
    const targetThree = createTarget();

    targetOne.style.left = '-10px';
    targetThree.style.top = '-10px';

    new Tracker({
      targets: document.getElementsByClassName('target'),
      snapshots: [
        {
          callback({ DOMElement, pool }) {
            animate(DOMElement);
            poolCopy = pool;
          }
        }
      ]
    });

    await scroll(0, 10);
    expect(poolCopy[0]).to.be.an('array').that.has.length(1);
    expect(poolCopy[0]).to.include(targetTwo);
  });

  describe('Edges', () => {
    beforeEach(beforeEachHook);
    afterEach(afterEachHook);

    it('edgeX', async () => {
      let poolCopy = {};
      const target = createTarget();
      target.style.marginLeft = `${window.innerWidth}px`;

      new Tracker({
        targets: document.getElementsByClassName('target'),
        snapshots: [
          {
            edgeX: 50,
            callback({ DOMElement, pool }) {
              animate(DOMElement);
              poolCopy = pool;
            }
          }
        ]
      });

      /* Scroll less than the edge */
      await scroll(50, 0);
      expect(Object.keys(poolCopy)).to.have.length(0);

      /* Scroll more than the edge */
      await scroll(window.innerWidth + targetSize * 0.75, 0);
      expect(Object.keys(poolCopy)).to.have.length(0);

      /* Scroll so the edge becomes visible */
      await scroll(150, 0);
      expect(poolCopy[0]).to.not.be.undefined;
      expect(poolCopy[0]).to.be.an('array').that.has.length(1);
      expect(poolCopy[0]).to.include(target);
    });

    it('edgeY', async () => {
      let poolCopy = {};
      const target = createTarget();
      target.style.marginTop = `${window.innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeY: 50,
            callback({ DOMElement, pool }) {
              animate(DOMElement);
              poolCopy = pool;
            }
          }
        ]
      });

      await scroll(0, 50);
      expect(Object.keys(poolCopy)).to.have.length(0);

      await scroll(0, window.innerHeight + targetSize * 0.75);
      expect(Object.keys(poolCopy)).to.have.length(0);

      await scroll(0, window.innerHeight);
      expect(poolCopy[0]).to.not.be.undefined;
      expect(poolCopy[0]).to.be.an('array').that.has.length(1);
      expect(poolCopy[0]).to.include(target);
    });

    it('edgeX + edgeY', async () => {
      let poolCopy = {};
      const target = createTarget();
      target.style.marginLeft = `${window.innerWidth}px`;
      target.style.marginTop = `${window.innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeX: 25,
            edgeY: 50,
            callback({ DOMElement, pool }) {
              animate(DOMElement);
              poolCopy = pool;
            }
          }
        ]
      });

      /* Scroll less than the desired edges */
      await scroll(50, 50);
      expect(Object.keys(poolCopy)).to.have.length(0);

      /* Scroll more than the desired edges */
      await scroll(
        window.innerWidth + targetSize * 0.5,
        window.innerHeight + targetSize * 0.75
      );
      expect(Object.keys(poolCopy)).to.have.length(0);

      /* Scroll so that edges are visible */
      await scroll(
        window.innerWidth + targetSize * 0.15,
        window.innerHeight + targetSize * 0.35
      );
      expect(poolCopy[0]).to.not.be.undefined;
      expect(poolCopy[0]).to.be.an('array').that.has.length(1);
      expect(poolCopy[0]).to.include(target);
    });
  });

});
