/* @flow */
import type { TClientRect } from '../types/ClientRect';
import type { TTrackingOptions, TPublicMethods } from '../types/TrackingKit';
import type { TSnapshot, TSnapshotOptions, TSnapshotSummary } from '../types/Snapshot';
import { ensureArray, getClientRect } from './utils';

/**
 * Tracking kit
 */
export default class TrackingKit {
  options: TTrackingOptions;

  constructor(options: TTrackingOptions): TPublicMethods {
    this.options = options;

    /* Ensure targets are iterable */
    this.options.targets = ensureArray(options.targets);

    /* Attach scroll event listener */
    window.addEventListener('scroll', this.trackVisibility, false);

    /* Define public API and return it */
    return {
      trackVisibility: this.trackVisibility
    };
  }

  /**
   * Track visibility
   * This method provides sequential tracking of targets by described snapshots.
   * In order to increase its performance, first it determines if relative bounds are
   * in the visible viewport. If not, no snapshots are taken.
   */
  trackVisibility(): void {
    const { options } = this;

    options.snapshots.forEach((snapshot: TSnapshot) => {
      /* Determine if snapshot's bounds lie within the current viewport */
      const bounds: HTMLElement = snapshot.bounds || options.bounds;
      const boundsRect: TClientRect = getClientRect(bounds);

      /**
       * Determine bounds' bleeding edges.
       * Keep bounds' bleeding edges absolute by adding current scroll position.
       * Without this, bounds' bleeding edges will change relatively to the
       * scroll position. This leads to wrong comparison between bounds and viewport.
       */
      const boundsEdges = {
        x: boundsRect.right - boundsRect.width + window.scrollX,
        y: boundsRect.bottom - boundsRect.height + window.scrollY
      };

      /**
       * Determine current viewport's coordinates.
       * Adding current scroll position to the viewport's rectangle ensures viewport
       * mask is "moving" with the scroll. Otherwise, bounds would be analyzed toward
       * the viewport's rectangle on the initial load.
       */
      const viewport = {
        top: (window.innerHeight || window.documentElement.clientHeight) + window.scrollY,
        right: (window.innerWidth || window.documentElement.clientWidth) + window.scrollX
      };

      /* Compare the two to determine if bounds lie within the viewport */
      const isBoundsVisible = (
        /* When X or Y have negative coordinates, they cannot be within the viewport */
        (boundsEdges.x >= 0) && (boundsEdges.y >= 0) &&
        /* While their positive coordinates should lie within the viewport's boundaries */
        (boundsEdges.x <= viewport.right) && (boundsEdges.y <= viewport.top)
      );

      /**
       * When bounds rectangle is not visible within the current viewport there is no need to
       * analyze anything. Ignoring the tracking to save up resources.
       */
      if (!isBoundsVisible) {
        return;
      }

      /**
       * Get the target(s).
       * Target(s) provided in the snapshot options have higher priority and
       * overwrite the target(s) provided in the root options.
       */
      const targets = snapshot.targets || options.targets;

      /* Iterate through each target and make respective snapshots */
      targets.forEach((target) => {
        /* Get client rectangle of the target */
        const targetRect: TClientRect = getClientRect(target);

        /**
         * When tracking relatively to the window, take the current
         * scroll position by both axis into account.
         */
        if (bounds === window) {
          targetRect.right += window.scrollX;
          targetRect.bottom += window.scrollY;
        }

        /* Take a snapshot */
        const snapshotSummary = this.takeSnapshot({
          snapshot,
          targetRect,
          boundsRect
        });

        if (snapshotSummary.matches) {
          /* Dispatch the callback once the snapshot matches */
          snapshot.callback({ DOMElement: target });
        }
      });

    });
  }

  /**
   * Take a snapshot
   */
  takeSnapshot(snapshotOptions: TSnapshotOptions): TSnapshotSummary {
    const { snapshot, targetRect, boundsRect } = snapshotOptions;
    const { name, offsetX, offsetY, thresholdX, thresholdY } = snapshot;

    /* Ensure offsets */
    const offsets = {
      x: offsetX || 0,
      y: offsetY || 0
    };

    /* Ensure thresholds */
    const thresholds = {
      x: thresholdX || 100,
      y: thresholdY || 100
    };

    /**
     * Calculate expected dimensions.
     * Threshold options affect the target's width and height to be visible in order to
     * consider the snapshot successful.
     */
    const expectedWidth = (targetRect.width * (100 - thresholds.x || 1) / 100);
    const expectedHeight = (targetRect.height * (100 - thresholds.y || 1) / 100);

    /**
     * Determine bleeding edges for each axis.
     * Bleeding edge - is an imaginary line which lies within the target rectangle and which
     * should appear within the given boundaries.
     */
    const edges = {
      x: (targetRect.right - expectedWidth) + offsets.x,
      y: (targetRect.bottom - expectedHeight) + offsets.y
    };

    /* Determine if bleeding edges lie within the given boundaries */
    const visible = {
      byX: (edges.x <= boundsRect.right) && (edges.x >= boundsRect.left),
      byY: (edges.y <= boundsRect.bottom) && (edges.y >= boundsRect.top)
    };

    return {
      visible,
      matches: (visible.byX && visible.byY)
    }
  }

  /**
   * Execute given function in debug mode only
   */
  debug(func: Function): void {
    if (this.options.debug) func();
  }
}
