/* @flow weak */
import type {
  TAxisObject,
  TOptions,
  TPool,
  TPoolEntry,
  TPublicMethods
} from '../types/Tracker';
import type { TSnapshot, TSnapshotOptions, TSnapshotSummary } from '../types/Snapshot';
import { hasValidProps } from './props';
import Area from './Area';
import { isset, throttle, ensureArray, ensureSnapshots } from './utils';

const defaultOptions: Object = {
  bounds: window,
  throttle: 250
};

/**
 * Tracker.
 */
export default class Tracker {
  options: TOptions;
  pool: TPool;

  constructor(options: TOptions): TPublicMethods {
    /* Verify that passed options/props are valid */
    hasValidProps(options);

    this.options = {
      ...defaultOptions,
      ...options,

      /* Ensure targets are iterable */
      iterableTargets: ensureArray(options.targets),

      /* Ensure snapshots have iterable targets */
      snapshots: ensureSnapshots(options.snapshots, options)
    };

    /* Pool of already tracked elements */
    this.pool = {};

    if (!options.manual) {
      /* Attach scroll event listener */
      window.addEventListener('scroll', throttle(this.track, options.throttle), false);
    }

    /* Return public methods */
    return this;
  }

  /**
   * Track visibility.
   * This method provides sequential tracking of targets by described snapshots.
   * In order to increase its performance, first it determines if relative bounds are
   * in the visible viewport. If not, no snapshots are taken.
   */
  track = (): void => {
    const { options } = this;

    /* Get the area of current viewport */
    const viewportArea: Area = new Area(window);

    /* Debugging */
    this.debug(() => {
      console.log(' ');
      console.groupCollapsed('Tracking attempt');
      console.log('Tracking options:', options);
      console.log('Viewport area:', viewportArea);
    });

    options.snapshots.forEach((snapshot: TSnapshot, snapshotIndex: number) => {
      /* Get bounds and their client rectangle */
      const bounds: window | HTMLElement = snapshot.bounds || options.bounds;
      const isBoundsWindow: boolean = (bounds === window);
      const boundsArea: Area = isBoundsWindow ? viewportArea : new Area(bounds, { absolute: true });

      /**
       * Determine if current bounds lie within the visible viewport.
       * When bounds are {window}, there is no need to check, since it is a viewport itself.
       */
      const isBoundsVisible: boolean = (
        isBoundsWindow ||
        viewportArea.contains(boundsArea, { weak: true })
      );

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
      const iterableTargets: Array<HTMLElement> = snapshot.iterableTargets || options.iterableTargets;
      const once: boolean = isset(snapshot.once) ? snapshot.once : options.once;

      /* Debugging */
      this.debug(() => {
        console.groupCollapsed('01 Snapshot attempt');
        console.log('Bounds:', bounds);
        console.log('Bounds area:', boundsArea);
        console.log('Absolute tracking:', isBoundsWindow);
        console.log('Bounds in viewport:', isBoundsVisible);
        console.log('Iterable targets:', iterableTargets);
        console.log('Unique impressions:', once);
        console.groupEnd();
      });

      /* Iterate through each target and make respective snapshots */
      iterableTargets.forEach((target: HTMLElement) => {
        const poolEntry: TPoolEntry = this.pool[snapshotIndex];
        const isTargetInPool = poolEntry && poolEntry.includes(target);

        /* Debugging */
        this.debug(() => {
          console.groupCollapsed('02 Iterating through targets...');
        });

        /* Skip tracking when "once" is set and target was already tracked */
        if (once && isTargetInPool) {
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
        const snapshotSummary: TSnapshotSummary = this.takeSnapshot({
          snapshot,
          targetArea: targetArea.toAbsolute(),
          boundsArea,
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

          /* Store matched target (HTMLElement) in the pool */
          if (!isTargetInPool) {
            if (poolEntry) {
              this.pool[snapshotIndex].push(target);
            } else {
              this.pool[snapshotIndex] = [target];
            }
          }
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
  takeSnapshot(snapshotOptions: TSnapshotOptions): TSnapshotSummary {
    const { snapshot, targetArea, boundsArea, viewportArea } = snapshotOptions;
    const { name, offsetX, offsetY, thresholdX, thresholdY, edgeX, edgeY } = snapshot;
    const shouldTrackEdges: boolean = isset(edgeX) || isset(edgeY);

    /* Ensure offsets */
    const offsets: TAxisObject = {
      x: offsetX || 0,
      y: offsetY || 0
    };

    if (shouldTrackEdges) {
      /**
       * Calculate bleeding edges.
       * Bleeding edge represents an imaginary line with an absolute coordinate, which is
       * expected to appear in the bounds/viewport.
       */
      const edges: Object = {
        x: edgeX && targetArea.left + (targetArea.width * edgeX / 100) + offsets.x,
        y: edgeY && targetArea.top + (targetArea.height * edgeY / 100) + offsets.y
      };

      /**
       * First, check if the edge lies within the viewport, then check if it lies within the
       * bounds. The edge should lie within the both mentioned boundaries in order to
       * satisfy the tracking criteria.
       */
      const edgeMatches: boolean = viewportArea.containsEdge(edges) && boundsArea.containsEdge(edges);

      return { matches: edgeMatches };
    }

    /* Ensure thresholds */
    const thresholds: TAxisObject = {
      x: thresholdX || 100,
      y: thresholdY || 100
    };

    /**
     * Calculate expected dimensions.
     * Threshold options affect the target's width and height to be visible in order to
     * consider the snapshot successful.
     */
    const expectedWidth: number = targetArea.width * ((thresholds.x || 100) / 100);
    const expectedHeight: number = targetArea.height * ((thresholds.y || 100) / 100);

    /**
     * Get intersection delta area.
     * Delta (intersection) area is an area of the target which currently lies within the
     * boundaries of bounds rectangle. When tracking relatively to the custom boundaries,
     * only the intersected areas should be tracked.
     */
    const deltaArea: Area = boundsArea.intersect(targetArea);

    /**
     * Determine if delta area's dimensions match expected dimensions
     * affected by offsets and thresholds.
     */
    const deltaMatches: Object = {
      byX: (deltaArea.width + offsets.x) >= expectedWidth,
      byY: (deltaArea.height + offsets.y) >= expectedHeight
    };

    /* Determine if achieved delta lies within the current viewport */
    const deltaInViewport: boolean = viewportArea.contains(deltaArea);

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
      console.groupEnd();
    });

    /* Compose a summary object */
    return {
      matches: deltaMatches.byX && deltaMatches.byY && deltaInViewport
    };
  }

  /**
   * Execute given function in debug mode only
   */
  debug(func: Function): void {
    if (this.options.debug) func();
  }
}
