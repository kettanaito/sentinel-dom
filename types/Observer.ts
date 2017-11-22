import { TClientRect } from './ClientRect';
import { TSnapshot } from './Snapshot';

export type TAxisObject = {
  x: number,
  y: number
};

/* Tracking target */
export type TObservableTargets = HTMLElement[] | HTMLElement;
export type TObservableBounds = Window | HTMLElement;

/* Observer options */
export type TObserverOptions = {
  targets: TObservableTargets, // targets in the DOM to track
  bounds?: TObservableBounds, // boundaries against which the targets are tracked
  snapshots: TSnapshot[], // collection of snapshots to apply
  throttle?: number, // throttle delay between the tracking attempts
  offsetX?: number, // horizontal offset (px) applied to the horizontal bleeding edge
  offsetY?: number, // vertical offset (px) applied to the vertical bleeding edge
  thresholdX?: number, // width threshold (%) to consider element tracked
  thresholdY?: number, // height threshold (%) to consider element tracked
  once?: boolean, // whether each snapshot should be tracked only once
  manual?: boolean, // enable manual tracking mode
  debug?: boolean, // perform tracking in a debug mode

  /* Private */
  iterableTargets: HTMLElement[],
}

/* A single pool entry */
export type TObserverPoolEntry = Array<HTMLElement>;

/* Pool of the tracked targets */
export type TObserverPool = {
  [snapshotIndex: number]: TObserverPoolEntry
}

/**
 * Tracking kit public methods.
 * Object returned after tracking kit construction.
 */
export type TPublicMethods = {
  track: () => void // manually perform visibility tracking
}
