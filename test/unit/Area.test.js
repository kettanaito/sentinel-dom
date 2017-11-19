import 'jsdom-global/register';
import { expect } from 'chai';
import { Area } from '../../lib';

describe('Area', () => {
  it('Should not be undefined', () => expect(Area).to.not.be.undefined);

  const AParent = new Area({ top: 100, right: 200, bottom: 200, left: 100 });

  it('Should calculate "contains"', () => {
    const parentArea = new Area({ top: 0, right: 500, bottom: 500, left: 0 });
    const areaWithin = new Area({ top: 50, right: 100, bottom: 50, left: 50 });
    const partArea = new Area({ top: 0, right: 400, bottom: 750, left: 10 });

    expect(parentArea.contains(areaWithin)).to.be.true;
    expect(areaWithin.contains(parentArea)).to.be.false;

    /* Containing partial area and weak mode */
    expect(parentArea.contains(partArea)).to.be.false;
    expect(parentArea.contains(partArea, { weak: true })).to.be.true;
  });

  it('Should calculate "containsEdge"', () => {
    const parentArea = new Area({ top: 0, right: 500, bottom: 500, left: 0 });
    const edgeOne = { x: 20 };
    const edgeTwo = { y: 20 };
    const edgeThree = { x: 20, y: 20 };
    const edgeFour = { x: 550, y: 550 };

    expect(parentArea.containsEdge(edgeOne)).to.be.true;
    expect(parentArea.containsEdge(edgeTwo)).to.be.true;
    expect(parentArea.containsEdge(edgeThree)).to.be.true;
    expect(parentArea.containsEdge(edgeFour)).to.be.false;
  });

  it('Should calculate "intersect" with area within the parent', () => {
    const AWithin = new Area({ top: 125, right: 175, bottom: 175, left: 125 });
    const intersection = AParent.intersect(AWithin);

    expect(intersection).to.deep.equal(AWithin);
  });

  it('Should calculate "intersect" with area bottom left', () => {
    const ABottomLeft = new Area({ top: 150, right: 150, bottom: 250, left: 50 });
    const intersection = AParent.intersect(ABottomLeft);

    expect(intersection).to.deep.equal(new Area({
      top: ABottomLeft.top,
      right: ABottomLeft.right,
      bottom: AParent.bottom,
      left: AParent.left,
      height: AParent.bottom - ABottomLeft.top,
      width: ABottomLeft.right - AParent.left
    }));
  });

  it('Should calculate "intersect" with area top right', () => {
    const ATopRight = new Area({ top: 50, right: 250, bottom: 150, left: 150 });
    const intersection = AParent.intersect(ATopRight);

    expect(intersection).to.deep.equal(new Area({
      top: AParent.top,
      right: AParent.right,
      bottom: ATopRight.bottom,
      left: ATopRight.left,
      height: ATopRight.bottom - AParent.top,
      width: AParent.right - ATopRight.left
    }));
  });
});
