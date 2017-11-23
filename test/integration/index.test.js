import { Observer, Area } from '../../lib';

describe('Basics', function () {
  it('Library exports are fine', function () {
    expect(Observer).to.not.be.undefined;
    expect(Area).to.not.be.undefined;
  });
});

/* Test groups */
require('./Observer/index.test');

/* Bugfixes */
require('./bugfixes/index.test');
