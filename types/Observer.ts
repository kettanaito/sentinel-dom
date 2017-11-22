import { TSnapshot } from './Snapshot';
import { ensureSnapshots } from '../src/utils';

export type TAxisObject = {
  x: number,
  y: number
};

/* Tracking target */
export type TObservableTargets = HTMLElement[] | HTMLElement;
export type TObservableBounds = Window | HTMLElement;

/* Observer options */
export class TObserverOptions {
  /** Tracked target elements */
  targets: TObservableTargets

  /** Tracked boundaries */
  bounds?: TObservableBounds = window

  /** A collection of snapshots to perform */
  snapshots: TSnapshot[]

  /** Throttle delay between the tracking attempts */
  throttle?: number = 250

  /** Horizontal offset (px) applied to the horizontal bleeding edge */
  offsetX?: number = 0

  /** Vertical offset (px) applied to the vertical bleeding edge */
  offsetY?: number = 0

  /** Width threshold (%) to consider element tracked */
  thresholdX?: number = 100

  /** Height threshold (%) to consider element tracked */
  thresholdY?: number = 100

  /** Whether each snapshot should be tracked only once */
  once?: boolean = false

  /** Enable manual tracking mode */
  manual?: boolean = false

  /** Enable/disabled debug mode */
  debug?: boolean = false

  /* Private instances */
  iterableTargets: HTMLElement[]

  constructor(options: TObserverOptions) {
    Object.keys(options).forEach((optionName) => this[optionName] = options[optionName]);
    return this;
  }
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
