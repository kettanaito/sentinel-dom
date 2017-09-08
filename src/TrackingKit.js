/* @flow */
import type { TTrackingOptions, TPublicMethods } from '../types/TrackingKit';
import type { TSnapshot, TSnapshotOptions, TSnapshotSummary } from '../types/Snapshot';
import Area from './Area';
import { ensureArray } from './utils';

const defaultOptions = {
  bounds: window,
  throttle: 1000
};

/**
 * Tracking kit
 */
export default class TrackingKit {
  pool: Array<HTMLElement>;
  options: TTrackingOptions;

  constructor(options: TTrackingOptions): TPublicMethods {
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
    return this;
  }

  /**
   * Track visibility
   * This method provides sequential tracking of targets by described snapshots.
   * In order to increase its performance, first it determines if relative bounds are
   * in the visible viewport. If not, no snapshots are taken.
   */
  trackVisibility = (): void => {
    const { options } = this;

    /* Get the area of current viewport */
    const viewportArea = new Area(window);

    /* Debugging */
    this.debug(() => {
      console.log(' ');
      console.groupCollapsed('Tracking attempt');
      console.log('Tracking options:', options);
      console.log('Viewport area:', viewportArea);
    });

    options.snapshots.forEach((snapshot: TSnapshot) => {
      /* Get bounds and their client rectangle */
      const bounds: window | HTMLElement = snapshot.bounds || options.bounds;
      const isBoundsWindow = (bounds === window);
      const boundsArea: Area = isBoundsWindow ? viewportArea : new Area(bounds);

      /**
       * Determine if current bounds lie within the visible viewport.
       * When bounds are {window}, there is no need to check, since it is always visible
       * in the viewport.
       */
      let isBoundsVisible = isBoundsWindow;

      if (!isBoundsVisible) {
        isBoundsVisible = viewportArea.contains(boundsArea, { weak: true });
      }

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
        console.log('Bounds area:', boundsArea);
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
        const targetArea: Area = new Area(target);

        this.debug(() => {
            console.log('Current target:', target);
            console.log('Target area:', targetArea);
          console.groupEnd();
        });

        /* Take a snapshot */
        const snapshotSummary = this.takeSnapshot({
          snapshot,
          targetArea: targetArea.toAbsolute(),
          boundsArea: isBoundsWindow ? boundsArea : boundsArea.toAbsolute(),
          viewportArea
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
    const { snapshot, targetArea, boundsArea, viewportArea } = snapshotOptions;
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
    const expectedWidth = targetArea.width * ((thresholds.x || 100) / 100);
    const expectedHeight = targetArea.height * ((thresholds.y || 100) / 100);

    /**
     * Get intersection delta area.
     * Delta (intersection) area is an area of the target which currently lies within the
     * boundaries of bounds rectangle. When tracking relatively to the custom boundaries,
     * only the intersected areas should be tracked.
     */
    const deltaArea = boundsArea.intersect(targetArea);

    /**
     * Determine if delta area's dimensions match expected dimensions
     * affected by offsets and thresholds.
     */
    const deltaMatches = {
      byX: (deltaArea.width + offsets.x) >= expectedWidth,
      byY: (deltaArea.height + offsets.y) >= expectedHeight
    };

    /* Determine if achieved delta lies within the current viewport */
    const deltaInViewport = viewportArea.contains(deltaArea);

    /* Compose a summary object */
    const snapshotSummary = {
      deltaMatches,
      deltaInViewport,
      matches: deltaMatches.byX && deltaMatches.byY && deltaInViewport
    };

    /* Debugging */
    this.debug(() => {
      console.groupCollapsed(`03 Taking a snapshot${name ? ` "${name}"` : ''}...`);
        console.group('Snapshot options');
          console.log('Snapshot:', snapshot);
          console.log('Target rectangle:', targetArea);
          console.log('Offsets (px):', offsets);
          console.log('Thresholds (%):', thresholds);
        console.groupEnd();

        console.group('Deltas');
          console.log('Expected width:', expectedWidth);
          console.log('Expected height:', expectedHeight);
          console.log('Bounds absolute area:', boundsArea);
          console.log('Delta area:', deltaArea);
          console.log('Delta in viewport:', deltaInViewport);
        console.groupEnd();

        console.group('Horizontal visibility');
          console.log('Expects', deltaArea.width, '(HD) >=', expectedWidth, '(expectedWidth)');
          console.log('deltaMatches horizontally:', deltaMatches.byX);
        console.groupEnd();

        console.group('Vertical visibility');
          console.log('Expects', deltaArea.height, '(VD) >=', expectedHeight, '(expectedHeight)');
          console.log('deltaMatches vertically:', deltaMatches.byY);
        console.groupEnd();

        console.group('Snapshot summary');
          console.log(snapshotSummary);
        console.groupEnd();
      console.groupEnd();
    });

    return snapshotSummary;
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
