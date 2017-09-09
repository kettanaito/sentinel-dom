import 'jsdom-global/register';
import { expect } from 'chai';
import Area from '../src/Area';

describe('Area', () => {
  it('can be imported', () => expect(Area).to.not.be.undefined);

  const AParent = new Area({ top: 100, right: 200, bottom: 200, left: 100 });

  it('contains', () => {
    const parentArea = new Area({ top: 0, right: 500, bottom: 500, left: 0 });
    const areaWithin = new Area({ top: 50, right: 100, bottom: 50, left: 50 });
    const partArea = new Area({ top: 0, right: 400, bottom: 750, left: 10 });

    expect(parentArea.contains(areaWithin)).to.be.true;
    expect(areaWithin.contains(parentArea)).to.be.false;

    /* Containing partial area and weak mode */
    expect(parentArea.contains(partArea)).to.be.false;
    expect(parentArea.contains(partArea, { weak: true })).to.be.true;
  });

  it('interesect: area within the parent', () => {
    const AWithin = new Area({ top: 125, right: 175, bottom: 175, left: 125 });
    const intersection = AParent.intersect(AWithin);

    expect(intersection.getClientRect()).to.deep.equal(AWithin.getClientRect());
  });

  it('interesect: area bottom left', () => {
    const ABottomLeft = new Area({ top: 150, right: 150, bottom: 250, left: 50 });
    const intersection = AParent.intersect(ABottomLeft);

    expect(intersection.getClientRect()).to.deep.equal({
      top: ABottomLeft.top,
      right: ABottomLeft.right,
      bottom: AParent.bottom,
      left: AParent.left,
      height: AParent.bottom - ABottomLeft.top,
      width: ABottomLeft.right - AParent.left
    });
  });

  it('intersect: area top right', () => {
    const ATopRight = new Area({ top: 50, right: 250, bottom: 150, left: 150 });
    const intersection = AParent.intersect(ATopRight);

    expect(intersection.getClientRect()).to.deep.equal({
      top: AParent.top,
      right: AParent.right,
      bottom: ATopRight.bottom,
      left: ATopRight.left,
      height: ATopRight.bottom - AParent.top,
      width: AParent.right - ATopRight.left
    });
  });
});
