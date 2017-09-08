/* @flow */
import type { TClientRect } from '../types/ClientRect';
import type { TTrackingOptions, TPublicMethods } from '../types/TrackingKit';
import type { TSnapshot, TSnapshotOptions, TSnapshotSummary } from '../types/Snapshot';
import { ensureArray, getClientRect } from './utils';

/**
 * Tracking kit
 */
export default class TrackingKit {
  pool: Array<HTMLElement>;
  options: TTrackingOptions;

  constructor(options: TTrackingOptions): TPublicMethods {
    const defaultOptions = {
      bounds: window,
      throttle: 1000
    };

    this.options = {
      ...defaultOptions,
      ...options,

      /* Ensure targets are iterable */
      targets: ensureArray(options.targets),

      /* Ensure snapshots have iterable targets */
      snapshots: this.ensureSnapshotTargets(options.snapshots)
    };

    /* Pool of already tracked elements */
    this.pool = [];

    /* Attach scroll event listener */
    window.addEventListener('scroll', this.trackVisibility, false);

    /* Return public methods */
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
  trackVisibility = (): void => {
    const { options } = this;

    /* Debugging */
    this.debug(() => {
      console.log(' ');
      console.groupCollapsed('Tracking attempt');
      console.log('Tracking options:', options);
    });

    const viewportRect = getClientRect(window);

    options.snapshots.forEach((snapshot: TSnapshot) => {
      /* Get bounds and their client rectangle */
      const bounds: window | HTMLElement = snapshot.bounds || options.bounds;
      const isBoundsWindow = (bounds === window);
      const boundsRect: TClientRect = isBoundsWindow ? viewportRect : getClientRect(bounds);

      /**
       * Determine if current bounds lie within the visible viewport.
       * When bounds are {window}, there is no need to check, since it is always visible
       * in the viewport.
       */
      const isBoundsVisible = isBoundsWindow || this.boundsInViewport(boundsRect, viewportRect);

      /**
       * When bounds rectangle is not visible within the current viewport there is no need to
       * analyze anything. Ignoring the tracking to save up resources.
       */
      if (!isBoundsVisible) {
        this.debug(() => {
          console.warn('Boundaries lie outside of the viewport. Tracking is skipped.');
        });
        return;
      }

      /**
       * Get the target(s).
       * Target(s) provided in the snapshot options have higher priority and
       * overwrite the target(s) provided in the root options.
       */
      const targets = snapshot.targets || options.targets;
      const once = Boolean(snapshot.once || options.once);

      /* Debugging */
      this.debug(() => {
        console.groupCollapsed('01 Snapshot attempt');
        console.log('Bounds:', bounds);
        console.log('boundsRect:', boundsRect);
        console.log('Absolute tracking:', isBoundsWindow);
        console.log('Bounds in viewport:', isBoundsVisible);
        console.log('Targets:', targets);
        console.log('Unique impressions:', once);
        console.groupEnd();
      });

      /* Iterate through each target and make respective snapshots */
      targets.forEach((target: HTMLElement) => {
        /* Debugging */
        this.debug(() => {
          console.groupCollapsed('02 Iterating through targets...');
        });

        /* Skip tracking when "once" is set and target was already tracked */
        if (once && this.pool.includes(target)) {
          this.debug(() => {
              console.log('Target has been already tracked while only unique impressions are allowed. Skipping.');
              console.log('Tracking pool:', this.pool);
            console.groupEnd();
          });

          return;
        }

        /* Get client rectangle of the target */
        const targetRect: TClientRect = getClientRect(target);

        /**
         * When tracking relatively to the window, take the current
         * scroll position by both axis into account.
         */
        // if (isBoundsWindow) {
          targetRect.right += window.scrollX;
          targetRect.top += window.scrollY;
          targetRect.bottom += window.scrollY;
        // }

        this.debug(() => {
            console.log('Current target:', target);
            console.log('Target rectangle', targetRect);
          console.groupEnd();
        });

        /* Take a snapshot */
        const snapshotSummary = this.takeSnapshot({
          snapshot,
          targetRect,
          boundsRect: viewportRect
        });

        if (snapshotSummary.matches) {
          this.debug(() => {
            console.groupCollapsed('04 Perform snapshot callback');
              console.log('');
            console.groupEnd();
          });

          /* Dispatch the callback once the snapshot matches */
          snapshot.callback({ DOMElement: target });

          /* Store matched HTMLElement in the pool */
          this.pool.push(target);
        }
      });
    });

    /* Debugging */
    this.debug(() => {
      console.groupEnd();
    });
  }

  /**
   * Take a snapshot
   */
  takeSnapshot = (snapshotOptions: TSnapshotOptions): TSnapshotSummary => {
    const { snapshot, targetRect, boundsRect } = snapshotOptions;
    const { name, offsetX, offsetY, thresholdX, thresholdY } = snapshot;

    /* Ensure offsets */
    const offsets = {
      x: offsetX || 0, // todo test offsets
      y: offsetY || 0 // todo test offsets
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
    const expectedWidth = targetRect.width * ((thresholds.x || 100) / 100);
    const expectedHeight = targetRect.height * ((thresholds.y || 100) / 100);

    /**
     * Deltas.
     * Delta is an amount (px) of visible portion of the target. The reason for introducing
     * deltas is because when scrolling from bottom to top element would appear visible by
     * bottom coordinates comparison, while this is not true relatively to the provided
     * thresholds.
     */
    const deltas = {
      x: (targetRect.right <= boundsRect.right)
        ? boundsRect.right - targetRect.left
        : targetRect.right - boundsRect.left,
      y: (targetRect.bottom <= boundsRect.bottom)
        ? targetRect.bottom - boundsRect.top
        : boundsRect.bottom - targetRect.top
    };

    /**
     * Determine if the target is visible by comparing its current deltas with the respective
     * expected dimensions (width and height).
     */
    const visible = {
      byX: (deltas.x + offsets.x) >= expectedWidth,
      byY: (deltas.y + offsets.y) >= expectedHeight
    };

    /* Compose a summary object */
    const snapshotSummary = {
      visible,
      matches: (visible.byX && visible.byY)
    };

    /* Debugging */
    this.debug(() => {
      console.groupCollapsed(`03 Taking a snapshot${name ? ` "${name}"` : ''}...`);
        console.group('Snapshot options');
          console.log('Snapshot:', snapshot);
          console.log('Target rectangle:', targetRect);
          console.log('Bounds rectangle:', boundsRect);
          console.log('Offsets (px):', offsets);
          console.log('Thresholds (%):', thresholds);
          console.log('Deltas:', deltas);
        console.groupEnd();

        console.group('Deltas');
          console.log('Expected width:', expectedWidth);
          console.log('Horizontal delta (HD):', deltas.x);
          console.log('Expected height:', expectedHeight);
          console.log('Vertical delta (VD):', deltas.y);
        console.groupEnd();

        console.group('Horizontal visibility');
          console.log('Expects', deltas.x, '(HD) >=', expectedWidth, '(expectedWidth)');
          console.log('Visible horizontally:', visible.byX);
        console.groupEnd();

        console.group('Vertical visibility');
          console.log('Expects', deltas.y, '(VD) >=', expectedHeight, '(expectedHeight)');
          console.log('Visible vertically:', visible.byY);
        console.groupEnd();

        console.group('Snapshot summary');
          console.log(snapshotSummary);
        console.groupEnd();
      console.groupEnd();
    });

    return snapshotSummary;
  }

  /**
   * @summary Determine if given bounds lie within the given viewport.
   * Viewport is provided explicitly because it is used elsewhere, outside this method.
   * No need to re-declare variables.
   */
  boundsInViewport = (boundsRect: TClientRect, viewportRect: TClientRect): boolean => {
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

    /* Compare the two to determine if bounds lie within the viewport */
    const isBoundsVisible = (
      /* When X or Y have negative coordinates, they cannot be within the viewport */
      (boundsEdges.x >= 0) && (boundsEdges.y >= 0) &&

      /* While their positive coordinates should lie within the viewport's boundaries */
      (boundsEdges.x <= viewportRect.bottom) && (boundsEdges.y <= viewportRect.right)
    );

    this.debug(() => {
      console.groupCollapsed('00 Determine bounds visibility...');
        console.log('Scroll position X:', window.scrollX);
        console.log('Scroll position Y:', window.scrollY);
        console.log('Viewport rectangle:', viewportRect);
        console.log('Bounds rectangle:', boundsRect);
        console.log('Bounds edges:', boundsEdges);
      console.groupEnd();
    });

    return isBoundsVisible;
  }

  /**
   * Ensure snapshots' targets are iterable.
   */
  ensureSnapshotTargets = (snapshots: Array<TSnapshot>): Array<TSnapshot> => {
    return snapshots.map((snapshot: TSnapshot): TSnapshot => {
      const nextSnapshot = Object.assign({}, snapshot);

      if (nextSnapshot.targets) {
        nextSnapshot.targets = ensureArray(nextSnapshot.targets);
      }

      return nextSnapshot;
    });
  }

  /**
   * Execute given function in debug mode only
   */
  debug(func: Function): void {
    if (this.options.debug) func();
  }
}
