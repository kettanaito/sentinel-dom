/**
 * Absolute tracking (Basics)
 */
describe('Absolute tracking (Basics)', () => {
  let times = 0;

  before(() => addObserver(new Tracker({
    targets: targetSelector,
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

  it('should reject: target outside the viewport', async () => {
    createTarget({ marginLeft: '-30px' });
    createTarget({ marginTop: '-30px' });

    await scroll(1, 1);
    expect(times).to.equal(0);
  });

  it('should resolve: target within the viewport', async () => {
    createTarget({ marginTop: '30px' });

    await scroll(0, 10);
    expect(times).to.equal(1);
  });
});
