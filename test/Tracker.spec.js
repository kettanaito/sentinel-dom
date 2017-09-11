import 'jsdom-global/register';
import { expect } from 'chai';
import { Tracker } from '../src';

describe('Tracker', () => {
  it('can be imported', () => expect(Tracker).to.not.be.undefined);

  describe('Basics', () => {
    it('track relatively to the window', () => {
      return true;
    });
  });
});
