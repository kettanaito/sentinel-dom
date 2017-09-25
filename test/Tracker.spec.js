<<<<<<< 0747803d2a834e3bcbdc8ece3dc92df05fb74c86
import { expect } from 'chai';
import { Tracker } from '../src';
=======
const { Tracker } = Sentinel;

/* Shorthand callback declaration */
function callback(done, isTracked) {
  return function ({ DOMElement }) {
    DOMElement.classList.add('tracked');

    if (!isTracked) {
      isTracked = true;
      return done();
    }
  }
}

/* Disable throttling to align with continuous scrolling */
const throttle = 0;
let timer;
let isTracked = false;
>>>>>>> Tests: Provide basic test setup and a few Absolute tracking tests

describe('Tracker', () => {
  before() => {
    window.scrollTo(0, 0);
    document.getElementById('container').innerHTML = '';
    timer = setInterval(() => window.scrollBy(0, 50), 50);
  });

  after(() => clearInterval(timer));
  afterEach(() => isTracked = false);

  it('Should not be undefined', () => expect(Tracker).to.not.be.undefined);

  /**
   * Absolute tracking
   */
  describe('Absolute tracking', () => {
    it('Should track relatively to the window', (done) => {
      new Tracker({
        throttle,
        targets: document.getElementById('target-absolute'),
        snapshots: [
          { callback: callback(done, isTracked) }
        ]
      });
    });
  });

  /**
   * Realtive tracking
   */
  describe('Relative tracking', () => {
    it('Should track relatively to the bounds', (done) => {
      const targetWithin = document.getElementById('target-relative-within');

      new Tracker({
        throttle,
        targets: document.getElementsByClassName('target-relative'),
        bounds: document.getElementById('target-relative-bounds'),
        snapshots: [
          {
            callback: ({ DOMElement, pool }) => {
              expect(pool[0]).to.have.length(1);
              expect(pool[0]).to.include(targetWithin);

              const fn = callback(done, isTracked);
              return fn({ DOMElement });
            }
          }
        ]
      })
    });
  });
});
