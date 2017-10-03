/**
 * Thresholds
 */
describe('Thresholds', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);

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
