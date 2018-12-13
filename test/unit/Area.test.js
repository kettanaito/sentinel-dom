import { Area } from '../../lib'

describe('Area', () => {
  it('Should not be undefined', () => {
    expect(Area).not.toBeUndefined()
  })

  const AParent = new Area({ top: 100, right: 200, bottom: 200, left: 100 })

  it('Properly calculates "contains"', () => {
    const parentArea = new Area({ top: 0, right: 500, bottom: 500, left: 0 })
    const areaWithin = new Area({ top: 50, right: 100, bottom: 50, left: 50 })
    const partArea = new Area({ top: 0, right: 400, bottom: 750, left: 10 })

    expect(parentArea.contains(areaWithin)).toEqual(true)
    expect(areaWithin.contains(parentArea)).toEqual(false)

    /* Containing partial area in weak mode */
    expect(parentArea.contains(partArea)).toEqual(false)
    expect(parentArea.contains(partArea, { weak: true })).toEqual(true)
  })

  it('Properly calculates "containsEdge"', () => {
    const parentArea = new Area({ top: 0, right: 500, bottom: 500, left: 0 })
    const edgeOne = { x: 20 }
    const edgeTwo = { y: 20 }
    const edgeThree = { x: 20, y: 20 }
    const edgeFour = { x: 550, y: 550 }

    expect(parentArea.containsEdge(edgeOne)).toEqual(true)
    expect(parentArea.containsEdge(edgeTwo)).toEqual(true)
    expect(parentArea.containsEdge(edgeThree)).toEqual(true)
    expect(parentArea.containsEdge(edgeFour)).toEqual(false)
  })

  it('Properly calculates "intersect" with area within the parent', () => {
    const AWithin = new Area({ top: 125, right: 175, bottom: 175, left: 125 })
    const intersection = AParent.intersect(AWithin)

    expect(intersection).toEqual(AWithin)
  })

  it('Properly calculates "intersect" with area bottom left', () => {
    const ABottomLeft = new Area({
      top: 150,
      right: 150,
      bottom: 250,
      left: 50,
    })
    const intersection = AParent.intersect(ABottomLeft)

    expect(intersection).toEqual(
      new Area({
        top: ABottomLeft.top,
        right: ABottomLeft.right,
        bottom: AParent.bottom,
        left: AParent.left,
        height: AParent.bottom - ABottomLeft.top,
        width: ABottomLeft.right - AParent.left,
      }),
    )
  })

  it('Properly calculates "intersect" with area top right', () => {
    const ATopRight = new Area({ top: 50, right: 250, bottom: 150, left: 150 })
    const intersection = AParent.intersect(ATopRight)

    expect(intersection).toEqual(
      new Area({
        top: AParent.top,
        right: AParent.right,
        bottom: ATopRight.bottom,
        left: ATopRight.left,
        height: ATopRight.bottom - AParent.top,
        width: AParent.right - ATopRight.left,
      }),
    )
  })
})
