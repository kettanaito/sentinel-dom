/**
 * Absolute tracking
 */
describe('Absolute tracking', () => {
  beforeEach(beforeEachHook);
  afterEach(afterEachHook);

  it('Basics', async () => {
    let times = 0;
    const targetOne = createTarget();
    const targetTwo = createTarget();
    const targetThree = createTarget();

    targetOne.style.marginLeft = '-10px';
    targetThree.style.marginTop = '-10px';

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
