import fs from 'fs';
import { Observer } from '../../lib';


describe('Basics', () => {
  it('Library exports are fine', () => {
    expect(Observer).to.not.be.undefined;
  });
});

require('./Observer/index.test');
