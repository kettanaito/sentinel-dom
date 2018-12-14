import createArea, { Area } from './createArea'
import containsArea from './containsArea'

/**
 * Returns intersection area of two given areas.
 */
export default function intersect(childArea: Area, parentArea: Area): Area {
  /**
   * When a child area entirely present within the parent area,
   * its intersection is, essentially, a child area.
   */
  if (containsArea(childArea, parentArea)) {
    return childArea
  }

  const areaPos = {
    left:
      childArea.right < parentArea.right && childArea.left < parentArea.left,
    above:
      childArea.bottom < parentArea.bottom && childArea.top < parentArea.top,
    within: {
      x: childArea.left > parentArea.left && childArea.right < parentArea.right,
      y: childArea.top > parentArea.top && childArea.bottom < parentArea.bottom,
    },
  }

  return createArea({
    top: areaPos.above ? parentArea.top : childArea.top,
    right:
      areaPos.left || areaPos.within.x ? childArea.right : parentArea.right,
    bottom:
      areaPos.above || areaPos.within.y ? childArea.bottom : parentArea.bottom,
    left: areaPos.left ? parentArea.left : childArea.left,
  })
}
