/* @flow */
import type { TClientRect } from './ClientRect';
import type { TSnapshot } from './Snapshot';

/**
 * Tracking target
 */
export type TTarget = Array<HTMLElement> | HTMLElement;

/**
 * Tracking Kit options
 */
export type TTrackingOptions = {
  targets: TTarget, // targets in the DOM to track
  bounds?: window | HTMLElement, // boundaries against which the targets are tracked
  snapshots: Array<TSnapshot>, // collection of snapshots to apply
  throttle?: number, // throttle delay between the tracking attempts
  offsetX?: number, // horizontal offset (px) applied to the horizontal bleeding edge
  offsetY?: number, // vertical offset (px) applied to the vertical bleeding edge
  thresholdX?: number, // width threshold (%) to consider element tracked
  thresholdY?: number, // height threshold (%) to consider element tracked
  once?: boolean, // whether each snapshot should be tracked only once
  manual?: boolean, // enable manual tracking mode
  debug?: boolean, // perform tracking in a debug mode

  /* Private */
  iterableTargets: Array<HTMLElement>,
}

/**
 * Tracking kit public methods.
 * Object returned after tracking kit construction.
 */
export type TPublicMethods = {
  trackVisibility: Function => void // manually perform visibility tracking
}
