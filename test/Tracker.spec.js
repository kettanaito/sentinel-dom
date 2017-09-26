import { expect } from 'chai';
import { Tracker } from '../src';

describe('Tracker', () => {
  it('Should not be undefined', () => expect(Tracker).to.not.be.undefined);

  it('Should track relatively to the window', () => {
    return true;
  });
});
