/**
 * Basics
 */
describe('Basics', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);

  /**
   * Absolute tracking
   */
  it('absolute tracking', async () => {
    let times = 0;
    let poolCopy;
    const targetOne = createTarget({ left: '-30px' });
    const targetTwo = createTarget({ top: '30px' });
    const targetThree = createTarget({ top: '-30px' });

    new Tracker({
      targets: document.getElementsByClassName('target'),
      snapshots: [
        {
          callback({ DOMElement, pool }) {
            animate(DOMElement);
            times++;
            poolCopy = pool;
          }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(1);
    expect(poolCopy).to.include(targetTwo);
  });

  /**
   * Relative tracking
   */
  it('relative tracking', async () => {
    let times = 0;
    let poolCopy;
    const targetOne = createTarget({ left: '-20px' }, bounds);
    const targetTwo = createTarget({ top: '-20px' }, bounds);
    const targetThree = createTarget({}, bounds);

    new Tracker({
      targets: document.getElementsByClassName('target'),
      bounds,
      snapshots: [
        {
          callback({ DOMElement, pool }) {
            animate(DOMElement);
            times++;
            poolCopy = pool;
          }
        }
      ]
    });

    await scroll(0, 10);
    expect(times).to.equal(1);
    expect(poolCopy).to.include(targetThree);
  });
});
