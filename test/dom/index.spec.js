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

describe('Absolute tracking', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);
  after(() => window.scrollTo(0, 0));

  it('Basics', async () => {
    let times = 0;
    const targetOne = createTarget();
    const targetTwo = createTarget();
    const targetThree = createTarget();

    targetOne.style.left = '-10px';
    targetThree.style.top = '-10px';

    new Tracker({
      targets: document.getElementsByClassName('target'),
      snapshots: [
        {
          callback({ DOMElement }) {
            animate(DOMElement);
            times++;
          }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(1);
  });

  describe('Edges', () => {
    beforeEach(beforeEachHook);
    afterEach(afterEachHook);

    it('edgeX', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginLeft = `${innerWidth}px`;

      new Tracker({
        targets: document.getElementsByClassName('target'),
        snapshots: [
          {
            edgeX: 50,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(50, 0);
      expect(times).to.equal(0);

      await scroll(innerWidth + targetSize * 0.75, 0);
      expect(times).to.equal(0);

      await scroll(150, 0);
      expect(times).to.equal(1);
    });

    it('edgeX + offsetX (positive)', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginLeft = `${innerWidth}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeX: 35,
            offsetX: 10,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(15, 0);
      expect(times).to.equal(0);

      await scroll(innerWidth + targetSize * 0.35 + 15, 0);
      expect(times).to.equal(0);

      await scroll(innerWidth + targetSize * 0.35 + 10, 0);
      expect(times).to.equal(1);
    });

    it('edgeX + offsetX (negative)', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginLeft = `${innerWidth}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeX: 35,
            offsetX: -10,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(15, 0);
      expect(times).to.equal(0);

      await scroll(innerWidth + targetSize * 0.35 + 15, 0);
      expect(times).to.equal(0);

      await scroll(innerWidth + targetSize * 0.35 - 15, 0);
      expect(times).to.equal(1);
    });

    it('edgeY', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginTop = `${innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeY: 50,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(0, 50);
      expect(times).to.equal(0);

      await scroll(0, innerHeight + targetSize * 0.75);
      expect(times).to.equal(0);

      await scroll(0, innerHeight);
      expect(times).to.equal(1);
    });

    it('edgeY + offsetY (positive)', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginTop = `${innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeY: 75,
            offsetY: 10,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(0, 50);
      expect(times).to.equal(0);

      await scroll(0, innerHeight + targetSize * 0.75 + 15);
      expect(times).to.equal(0);

      await scroll(0, innerHeight + targetSize * 0.75 + 5);
      expect(times).to.equal(1);
    });

    it('edgeY + offsetY (negative)', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginTop = `${innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeY: 75,
            offsetY: -10,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(0, 50);
      expect(times).to.equal(0);

      await scroll(0, innerHeight + targetSize * 0.75 + 15);
      expect(times).to.equal(0);

      await scroll(0, innerHeight + targetSize * 0.75 - 15);
      expect(times).to.equal(1);
    });

    it('edgeX + edgeY', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginLeft = `${innerWidth}px`;
      target.style.marginTop = `${innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeX: 25,
            edgeY: 50,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      /* Scroll less than the desired edges */
      await scroll(50, 50);

      /* Scroll more than the desired edges */
      await scroll(
        innerWidth + targetSize * 0.5,
        innerHeight + targetSize * 0.75
      );
      expect(times).to.equal(0);

      /* Scroll so that edges are visible */
      await scroll(
        innerWidth + targetSize * 0.15,
        innerHeight + targetSize * 0.35
      );
      expect(times).to.equal(1);
    });

    it('edgeX/Y + offsetX/Y (positive)', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginLeft = `${innerWidth}px`;
      target.style.marginTop = `${innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            edgeX: 25,
            edgeY: 50,
            offsetX: 15,
            offsetY: 10,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      /* Scroll less than the desired edges */
      await scroll(50, 50);

      /* Scroll more than the desired edges */
      await scroll(
        innerWidth + targetSize * 0.25 + 20,
        innerHeight + targetSize * 0.50 + 15
      );
      expect(times).to.equal(0);

      /* Scroll so that edges are visible */
      await scroll(
        innerWidth + targetSize * 0.25 - 20,
        innerHeight + targetSize * 0.50 - 15
      );
      expect(times).to.equal(1);
    });
  });

  /**
   * Thresholds
   */
  describe('Thresholds', () => {
    it('thresholdX', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginLeft = `${innerWidth}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            thresholdX: 25,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      /* Scroll to the less portion than the specified threshold */
      await scroll(targetSize * 0.15, 0);
      await scroll(innerWidth + 175, 0);
      expect(times).to.equal(0);

      /* Scroll so the threshold is visible LTR */
      await scroll(targetSize * 0.35, 0);
      expect(times).to.equal(1);

      /* Scroll so the threshold is visible RTL */
      await scroll(innerWidth + targetSize * 0.25, 0);
      expect(times).to.equal(2);
    });

    it('thresholdY', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginTop = `${innerHeight}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            thresholdY: 25,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      await scroll(0, targetSize * 0.15);
      await scroll(0, innerHeight + targetSize * 0.8);
      expect(times).to.equal(0);

      await scroll(0, targetSize * 0.35);
      expect(times).to.equal(1);

      await scroll(0, innerHeight + targetSize * 0.5);
      expect(times).to.equal(2);
    });

    it('thresholdX + thresholdY', async () => {
      let times = 0;
      const target = createTarget();
      target.style.marginTop = `${innerHeight}px`;
      target.style.marginLeft = `${innerWidth}px`;

      new Tracker({
        targets: target,
        snapshots: [
          {
            thresholdX: 25,
            thresholdY: 25,
            callback({ DOMElement }) {
              animate(DOMElement);
              times++;
            }
          }
        ]
      });

      /* Scroll outside of the expected thresholds */
      await scroll(targetSize * 0.15, targetSize * 0.15);
      await scroll(innerWidth + targetSize * 0.9, innerHeight + targetSize * 0.9);
      expect(times).to.equal(0);

      /* Scroll within the one of the thresholds */
      await scroll(targetSize * 0.5, 0);
      await scroll(0, targetSize * 0.5);
      expect(times).to.equal(0);

      /* Scroll within the expected thresholds */
      await scroll(targetSize * 0.5, targetSize * 0.5);
      expect(times).to.equal(1);

      await scroll(innerWidth + targetSize * 0.5, innerHeight + targetSize * 0.5);
      expect(times).to.equal(2);
    });
  });

});
