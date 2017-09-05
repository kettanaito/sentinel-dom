/* @flow */

/**
 * Tracking target type definition
 */
export type TTrackingTargets = Array<HTMLElement> | HTMLElement;

/**
 * A single snapshot definition
 */
export type TSnapshot = {
  /* Name of the snapshot for better debugging */
  name?: string,

  /* (Optional) Targets to track within the current snapshot */
  targets?: TTrackingTargets,

  /* (Optional) Custom boundaries to overwrite root boundaries */
  bounds?: HTMLElement,

  /* Offset width (px) to trigger the snapshot */
  offsetX?: number,

  /* Offset height (px) to trigger the snapshot */
  offsetY?: number,

  /* Width threshold (%) to consider element tracked */
  thresholdX?: number,

  /* Height threshold (%) to consider element tracked */
  thresholdY?: number,

  /* Whether the snapshot should be tracked only once */
  once?: boolean,

  /* Function to execute once tracking conditions are met */
  callback: (args: TSnapshotCallbackArgs) => any
}

type TSnapshotCallbackArgs = {
  DOMElement: Element
}

/**
 * Result object of a single taken snapshot
 */
export type TSnapshotResult = {
  visibleByX: boolean,
  visibleByY: boolean,
  matches: boolean
}

/**
 * Tracking Kit options
 */
export type TTrackingKitOptions = {
  /* Targets in the DOM to track */
  targets: TTrackingTargets,

  /* Boundaries against which the targets are tracked */
  bounds: HTMLElement,

  /* Throttle delay */
  throttle?: number,

  /* Whether each snapshot should be tracked only once */
  once?: boolean,

  /* Collection of snapshots to apply */
  snapshots: Array<TSnapshot>,

  /* Run tracking in a debug mode */
  debug?: boolean
}

/**
 * TrackingKit API
 * Object returned after tracking kit construction.
 */
export type TTrackingKitAPI = {
  trackVisibility: Function => void
}
