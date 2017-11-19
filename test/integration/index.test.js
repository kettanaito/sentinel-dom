import { Observer, Area } from '../../lib';

describe('Basics', () => {
  it('Library exports are fine', () => {
    expect(Observer).to.not.be.undefined;
    expect(Area).to.not.be.undefined;
  });
});

/* Require test groups */
require('./Observer/index.test');
