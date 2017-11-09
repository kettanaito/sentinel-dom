/**
 * Relative tracking (Basics)
 */
describe('Relative tracking (basics)', () => {
  let times = 0;

  before(() => addObserver(new Tracker({
    targets: targetSelector,
    bounds,
    snapshots: [
      {
        callback({ DOMElement }) {
          animate(DOMElement);
          times++;
        }
      }
    ]
  })));

  afterEach(() => {
    cleanUp();
    times = 0;
  });

  after(flushObserver);

  it('should reject: target outside the bounds', async () => {
    createTarget({ marginLeft: '-30px' }, bounds);

    await scroll(1, 1);
    expect(times).to.equal(0);
  });

  it('should reject: taregt outside the scrollable distance', async () => {
    createTarget({ marginLeft: `${innerWidth}px` }, bounds);

    await scroll(50, 50);
    expect(times).to.equal(0);
  });

  it('should resolve: target within the bounds', async () => {
    createTarget({ margin: '5px' }, bounds);

    await scroll(1, 1);
    expect(times).to.equal(1);
  });

  it('should resolve: target within scrollable distance', async () => {
    createTarget({ marginLeft: `${innerWidth}px` }, bounds);

    await scroll(innerWidth, 0);
    expect(times).to.equal(1);
  });
});
