import containsArea from './utils/containsArea'
import createArea from './utils/createArea'
import intersect from './utils/intersect'
import containsEdges from './utils/containsEdges'
import { isset } from '../utils'
// import setDimensions from './utils/setDimensions'

interface SnapshotOptions {
  thresholdX?: number
  thresholdY?: number
  offsetX?: number
  offsetY?: number
  edgeX?: number
  edgeY?: number
}

type SnapshotBounds = Window | HTMLElement

const defaultSnapshotOptions: SnapshotOptions = {
  thresholdX: 1,
  thresholdY: 1,
}

/**
 * Takes a snapshot that determines if the given element
 * is visible within the given bounds. Applies additional options,
 * whenever provided.
 */
export default function takeSnapshot(
  element: HTMLElement,
  bounds: SnapshotBounds = window,
  options: SnapshotOptions = defaultSnapshotOptions,
): boolean {
  const viewportArea = createArea(window)
  const boundsArea = bounds === window ? viewportArea : createArea(bounds, true)
  const elementArea = createArea(element, true)

  /**
   * Check if bounds are at least partially visible in the viewport.
   * Element cannot be visible if its boundaries are not visible.
   */
  const boundsInViewport = containsArea(boundsArea, viewportArea, false)
  if (!boundsInViewport) {
    return false
  }

  /* Snapshot options */
  const { edgeX, edgeY } = options
  const offsetX = options.offsetX || 0
  const offsetY = options.offsetY || 0
  const thresholdX = options.thresholdX || 1
  const thresholdY = options.thresholdY || 1

  const shouldTrackEdges = isset(edgeX) || isset(edgeY)

  /* Tracking edges bears exclusive character, and ignores thresholds */
  if (shouldTrackEdges) {
    const edges = {
      x:
        edgeX && elementArea.left + (elementArea.width * edgeX) / 100 + offsetX,
      y:
        edgeY && elementArea.top + (elementArea.height * edgeY) / 100 + offsetY,
    }

    return (
      /* Edges must be visible within both viewport and bounds */
      containsEdges(edges, viewportArea) && containsEdges(edges, boundsArea)
    )
  }

  // const expectedArea = setDimensions(
  //   {
  //     width: elementArea.width * (thresholdX / 100),
  //     height: elementArea.height * (thresholdY / 100),
  //   },
  //   elementArea,
  // )

  const expectedDimensions = {
    width: elementArea.width * thresholdX,
    height: elementArea.height * thresholdY,
  }
  const deltaArea = intersect(elementArea, viewportArea)
  const deltaMatches = {
    byX: deltaArea.width >= expectedDimensions.width + offsetX,
    byY: deltaArea.height >= expectedDimensions.height + offsetY,
  }
  const deltaInViewport = containsArea(deltaArea, viewportArea)
  const deltaInBounds = containsArea(deltaArea, boundsArea)

  return (
    deltaMatches.byX && deltaMatches.byY && deltaInViewport && deltaInBounds
  )
}
