/**
 * Absolute tracking
 */
describe('Absolute tracking', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);

  it('Basics', async () => {
    let times = 0;
    const targetOne = createTarget({ marginLeft: '-30px' });
    const targetTwo = createTarget({ marginTop: '30px' });
    const targetThree = createTarget({ marginTop: '-30px' });

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
});
