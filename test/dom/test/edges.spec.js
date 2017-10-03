/**
 * Edges
 */
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
