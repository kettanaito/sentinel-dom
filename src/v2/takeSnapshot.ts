import containsArea from './utils/containsArea'
import createArea from './utils/createArea'
import intersect from './utils/intersect'
import containsEdges from './utils/containsEdges'
import { isset } from '../utils'

export interface SnapshotOptions {
  bounds?: SnapshotBounds
  thresholdX?: number
  thresholdY?: number
  offsetX?: number
  offsetY?: number
  edgeX?: number
  edgeY?: number
}

export type SnapshotBounds = Window | HTMLElement

const defaultSnapshotOptions: SnapshotOptions = {
  bounds: window,
  thresholdX: 1,
  thresholdY: 1,
  offsetX: 0,
  offsetY: 0,
}

/**
 * Takes a snapshot that determines if the given element
 * is visible within the given bounds (default to `window`).
 * Applies any additional options apploed.
 */
export default function takeSnapshot(
  element: HTMLElement,
  options?: SnapshotOptions,
): boolean {
  const opStart = performance.now()

  const {
    bounds = window,
    edgeX,
    edgeY,
    offsetX,
    offsetY,
    thresholdX,
    thresholdY,
  } = Object.assign({}, defaultSnapshotOptions, options)

  const viewportArea = createArea(window)
  const boundsArea = bounds === window ? viewportArea : createArea(bounds, true)
  const elementArea = createArea(element, true)

  /* Get the visible subsection of the element area */
  const deltaArea = intersect(elementArea, viewportArea)

  /* Short circuit when element is not in the viewport */
  if (deltaArea.height < 1 || deltaArea.width < 1) {
    return false
  }

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

  const deltaMatches = {
    byX: deltaArea.width >= expectedDimensions.width + offsetX,
    byY: deltaArea.height >= expectedDimensions.height + offsetY,
  }

  /**
   * @todo If delta area is intersection with viewport,
   * can it be theoretically invisible? If area is invisible,
   * then its delta is negative. Then there is no need to check
   * if viewport contains the delta.
   */
  const deltaInViewport = containsArea(deltaArea, viewportArea)
  const deltaInBounds = containsArea(deltaArea, boundsArea)

  console.log('Finished in %sms', (performance.now() - opStart).toFixed(2))

  return (
    deltaMatches.byX && deltaMatches.byY && deltaInViewport && deltaInBounds
  )
}
