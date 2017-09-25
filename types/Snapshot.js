/* @flow */
import type { TClientRect } from './ClientRect';
import type { TTarget, TPool } from './Tracker';
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
  edgeX?: number, // horizontal bleeding edge (% of the width)
  edgeY?: number, // vertical bleeding edge (% of the height)
  once?: boolean, // whether the snapshot should be tracked only once
  callback: (args: TSnapshotCallbackArgs) => any, // callback function after successful snapshot

  /* Private */
  iterableTargets: Array<HTMLElement>
}

export type TSnapshotOptions = {
  snapshot: TSnapshot,
  targetArea: Area,
  boundsArea: Area,
  viewportArea: Area
}

type TSnapshotCallbackArgs = {
  DOMElement: HTMLElement, // reference to the DOMElement which became visible
  pool: TPool // pool of all tracked elements
}

/**
 * Result object of a single taken snapshot
 */
export type TSnapshotSummary = {
  matches: boolean // whether the target satisfies the provided tracking criterias
}
