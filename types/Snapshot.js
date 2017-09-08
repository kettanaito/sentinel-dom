/* @flow */
import type { TClientRect } from './ClientRect';
import type { TTarget } from './TrackingKit';
import Area from '../src/Area';

/**
 * A single snapshot definition
 */
export type TSnapshot = {
  name?: string, // name of the snapshot for better debugging
  targets: TTarget, // (optional) targets to track within the current snapshot
  bounds: HTMLElement, // (optional) custom boundaries to overwrite root boundaries
  offsetX?: number, // horizontal offset (px) applied to the horizontal bleeding edge
  offsetY?: number, // vertical offset (px) applied to the vertical bleeding edge
  thresholdX?: number, // width threshold (%) to consider element tracked
  thresholdY?: number, // height threshold (%) to consider element tracked
  once?: boolean, // whether the snapshot should be tracked only once
  callback: (args: TSnapshotCallbackArgs) => any // callback function after successful snapshot
}

export type TSnapshotOptions = {
  snapshot: TSnapshot,
  targetArea: Area,
  viewportArea: Area
}

type TSnapshotCallbackArgs = {
  DOMElement: HTMLElement // reference to the DOMElement which became visible
}

/**
 * Result object of a single taken snapshot
 */
export type TSnapshotSummary = {
  visible: {
    byX: boolean, // whether the target is visible horizontally
    byY: boolean // whether the target is visible vertically
  },
  matches: boolean // whether the target is fully visible (horizontally and vertically)
}
