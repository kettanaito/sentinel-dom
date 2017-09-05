/* @flow */
import type { TClientRect } from '../types/TClientRect';
import type {
  TTrackingKitOptions,
  TTrackingKitAPI,
  TSnapshot,
  TSnapshotResult
} from '../types/TrackingKit';
import { getClientRect } from './utils';

/**
 * Tracking kit
 */
export default class TrackingKit {
  options: TTrackingKitOptions;

  constructor(options: TTrackingKitOptions): TTrackingKitAPI {
    this.options = options;

    /* Ensure targets are iterable */
    if (!Array.isArray(options.targets)) {
      this.options.targets = [options.targets];
    }

    /* Attach scroll event listener */
    window.addEventListener('scroll', this.trackVisibility, false);

    /* Define public API and return it */
    const publicAPI: TTrackingKitAPI = {
      trackVisibility: this.trackVisibility
    };

    return publicAPI;
  }

  /**
   * Track visibility
   * This method provides sequential tracking of targets by described snapshots.
   * In order to increase its performance, first it determines if relative bounds are
   * in the visible viewport. If not, no snapshots are taken.
   */
  trackVisibility(): void {
    const options = this.options;

    options.snapshots.forEach((snapshot) => {
      const targetRect = snapshot.targetRect || options.targetRect;

      /* Determine if snapshot's bounds lie within the current viewport */
      const snapshotBounds: HTMLElement = snapshot.bounds || options.bounds;
      const snapshotRect: TClientRect = getClientRect(snapshotBounds);

      /* Determine bounds' bleeding edges */
      const boundsEdges = {
        /**
         * Keep bounds bleeding edges absolute by adding current scroll position.
         * Without this, bounds bleeding edges will change relatively to the
         * scroll position. This leads to wrong comparison between bounds and viewport.
         */
        x: snapshotRect.right - snapshotRect.width + window.scrollX,
        y: snapshotRect.bottom - snapshotRect.height + window.scrollY
      };

      /* Determine current viewport's coordinates */
      const viewport = {
        /**
         * Adding current scroll position to the viewport rectangle ensures viewport
         * mask is "moving" with the scroll. Otherwise, bounds would be analyzed toward
         * the viewport rectangle on the initial load.
         */
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
       * When bounds rectangle is not visible within the current viewport there is no
       * need to analyze anything. Ignoring the tracking to save up resources.
       */
      if (!isBoundsVisible) {
        return;
      }

      /**
       * When tracking the target relatively to the window, we need to take
       * current scroll position by both axis into account.
       */
      if (snapshotBounds === window) {
        targetRect.right += window.scrollX;
        targetRect.bottom += window.scrollY;
      }

      /* Take a snapshot */
      const snapshotResult = this.takeSnapshot({
        name: snapshot.name,
        targets: snapshot.targets || options.targets,
        bounds: snapshotRect,
        offsetX: snapshot.offsetX || options.offsetX,
        offsetY: snapshot.offsetY || options.offsetY,
        thresholdX: snapshot.thresholdX || options.thresholdX,
        thresholdY: snapshot.thresholdY || options.thresholdY,
        once: snapshot.once || options.once,
        callback: snapshot.callback
      });

      if (snapshotResult.matches) {
        // Target is within the given bounds
        snapshot.callback();
      }
    });
  }

  /**
   * Take a snapshot
   */
  takeSnapshot(snapshotOptions: TSnapshot): TSnapshotResult {
    const { name, targetRect, bounds, thresholdX, thresholdY } = snapshotOptions;

    /* Determine bleeding edges for each axis */
    const horizontalEdge = (targetRect.right - (targetRect.width * (100 - thresholdX || 1) / 100));
    const verticalEdge = (targetRect.bottom - (targetRect.height * (100 - thresholdY || 1) / 100));

    /* Determine if bleeding edges lie within the given boundaries */
    const visibleByX = ((horizontalEdge <= bounds.right) && (horizontalEdge >= bounds.left));
    const visibleByY = ((verticalEdge <= bounds.bottom) && (verticalEdge >= bounds.top));

    return {
      visibleByX,
      visibleByY,
      matches: visibleByX && visibleByY
    }
  }

  /**
   * Execute given function in debug mode only
   */
  print(func: Function) {
    if (this.options.debug) func();
  }
}
