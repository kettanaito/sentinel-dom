import 'jsdom-global/register';
import { expect } from 'chai';
import Area from '../src/Area';

describe('Area', () => {
  it('can be imported', () => expect(Area).to.not.be.undefined);

  it('contains: basics', () => {
    const area1 = new Area({
      top: 0,
      right: 500,
      bottom: 500,
      left: 0
    });

    const area2 = new Area({
      top: 50,
      right: 100,
      bottom: 50,
      left: 50
    });

    expect(area1.contains(area2)).to.be.true;
    expect(area2.contains(area1)).to.be.false;
  });
});
