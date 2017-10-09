/**
 * Relative tracking
 */
describe('Relative tracking', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);

  it('simple', async () => {
    let times = 0;
    const target = createTarget();

    new Tracker({
      targets: target,
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
});
