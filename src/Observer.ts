import {
  TAxisObject,
  TObserverOptions,
  TObservableTargets,
  TObservableBounds,
  TObserverPool,
  TObserverPoolEntry
} from '../types/Observer';
import { TSnapshot, TSnapshotOptions, TSnapshotResult } from '../types/Snapshot';
import { hasValidOptions } from './options';
import Area from './Area';
import { isset, throttle, ensureArray, ensureSnapshots } from './utils';

/**
 * Observer.
 */
export default class Observer {
  options: TObserverOptions;
  pool: TObserverPool;

  constructor(options: TObserverOptions) {
    /* Verify that passed options/props are valid */
    hasValidOptions(options);

    const observerOptions = new TObserverOptions(options);
    this.options = {
      ...observerOptions,

      /* Ensure snapshots have iterable targets */
      snapshots: ensureSnapshots(observerOptions.snapshots, observerOptions)
    };

    /* Pool of already tracked elements */
    this.pool = {};

    if (!observerOptions.manual) {
      /* Attach scroll event listener */
      window.addEventListener('scroll', throttle(this.track, observerOptions.throttle), false);
    }

    /* Return public methods */
    return this;
  }

  /**
   * Tracks visibility.
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
      const bounds: TObservableBounds = snapshot.bounds || options.bounds;
      const isBoundsViewport = (bounds === window);
      const boundsArea: Area = isBoundsViewport ? viewportArea : new Area(bounds, { absolute: true });

      /**
       * Determine if current bounds lie within the visible viewport.
       * When bounds are {window}, there is no need to check, since it is a viewport itself.
       */
      const isBoundsVisible = (
        isBoundsViewport ||
        viewportArea.contains(boundsArea, { weak: true })
      );

      /**
       * When bounds rectangle is not visible within the current viewport there is no need to
       * analyze anything. Ignoring the tracking to save up resources.
       */
      if (!isBoundsVisible) {
        this.debug(() => {
          console.warn('Boundaries lie outside of the viewport. Tracking attempt is skipped.');
        });
        return;
      }

      /**
       * Get the target(s).
       * Target(s) provided in the snapshot options have higher priority and
       * overwrite the target(s) provided in the root options.
       */
      const iterableTargets: TObservableTargets = ensureArray(snapshot.targets || options.targets);
      const once = (isset(snapshot.once) ? snapshot.once : options.once) || false;

      /* Debugging */
      this.debug(() => {
        console.groupCollapsed('01 Snapshot attempt');
        console.log('bounds:', bounds);
        console.log('bounds area:', boundsArea);
        console.log('absolute tracking:', isBoundsViewport);
        console.log('bounds in viewport:', isBoundsVisible);
        console.log('iterable targets:', iterableTargets);
        console.log('unique impressions:', once);
        console.groupEnd();
      });

      /* Iterate through each target and make respective snapshots */
      iterableTargets.forEach((target: HTMLElement) => {
        const poolEntry: TObserverPoolEntry = this.pool[snapshotIndex];
        const isTargetInPool = poolEntry && poolEntry.includes(target);

        /* Debugging */
        this.debug(() => {
          console.groupCollapsed('02 Iterating through targets...');
        });

        /* Skip tracking when "once" is set and target was already tracked */
        if (once && isTargetInPool) {
          this.debug(() => {
            console.log('Target has been already tracked while only unique impressions are allowed. Skipping.');
            console.log('tracking pool:', this.pool);
            console.groupEnd();
          });

          return;
        }

        /* Get client rectangle of the target */
        const targetArea: Area = new Area(target);

        this.debug(() => {
            console.log('current target:', target);
            console.log('target area:', targetArea);
          console.groupEnd();
        });

        /* Take a snapshot */
        const snapshotSummary: TSnapshotResult = this.takeSnapshot({
          snapshot,
          targetArea: targetArea.toAbsolute(),
          boundsArea,
          viewportArea,
          isBoundsViewport
        });

        if (snapshotSummary.matches) {
          this.debug(() => {
            console.groupCollapsed('04 Perform snapshot callback');
              console.log('');
            console.groupEnd();
          });

          /* Store matched target (HTMLElement) in the pool */
          if (!isTargetInPool) {
            if (poolEntry) {
              this.pool[snapshotIndex].push(target);
            } else {
              this.pool[snapshotIndex] = [target];
            }
          }

          /* Dispatch the callback once the snapshot matches */
          snapshot.callback({
            DOMElement: target,
            pool: this.pool
          });
        }
      });
    });

    /* Debugging */
    this.debug(() => {
      console.groupEnd();
    });
  }

  /**
   * Takes a snapshot with the provided snapshot options.
   */
  takeSnapshot(snapshotOptions: TSnapshotOptions): TSnapshotResult {
    const { snapshot, targetArea, boundsArea, viewportArea, isBoundsViewport } = snapshotOptions;
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
       * expected to appear in the bounds/viewport in order to resolve a snapshot.
       */
      const edges: TAxisObject = {
        x: edgeX && targetArea.left + (targetArea.width * edgeX / 100) + offsets.x,
        y: edgeY && targetArea.top + (targetArea.height * edgeY / 100) + offsets.y
      };

      /**
       * First, check if the edge lies within the viewport, then check if it lies within the
       * bounds. The edge should lie within the both mentioned boundaries in order to
       * satisfy the tracking criteria.
       */
      const edgesMatch = viewportArea.containsEdge(edges) && boundsArea.containsEdge(edges);

      return { matches: edgesMatch };
    }

    /* Ensure thresholds */
    const thresholds: TAxisObject = {
      x: thresholdX || 100,
      y: thresholdY || 100
    };

    /**
     * Calculate expected dimensions.
     * Depending on the threshold options, expected width and height are changed.
     * Offsets are not taken into account to prevent the dimensions distortion.
     */
    const expectedWidth = targetArea.width * (thresholds.x / 100);
    const expectedHeight = targetArea.height * (thresholds.y / 100);

    /**
     * Get delta area.
     * Delta (intersection) area is an area of the target which currently lies within the
     * boundaries of bounds rectangle. When tracking relatively to the custom boundaries,
     * only the intersected areas should be tracked.
     */
    const deltaArea: Area = viewportArea.intersect(targetArea);

    /**
     * Determine if delta area's dimensions match expected dimensions,
     * including offsets influence.
     */
    const deltaMatches = {
      byX: deltaArea.width >= (expectedWidth + offsets.x),
      byY: deltaArea.height >= (expectedHeight + offsets.y)
    };

    /* Determine if achieved delta lies within the current viewport */
    const deltaInViewport = viewportArea.contains(deltaArea);

    /**
     * Determine if delta area in inside the bounds area.
     * In case of absolute tracking bounds = viewport, so no extra calculations required.
     */
    const deltaInBounds = isBoundsViewport ? deltaInViewport : boundsArea.contains(deltaArea);

    /* Debugging */
    this.debug(() => {
      console.groupCollapsed(`03 Taking a snapshot${name ? ` "${name}"` : ''}...`);
        console.group('Snapshot');
          console.log('snapshot options:', snapshot);
          console.log('offsets (px):', offsets);
          console.log('thresholds (%):', thresholds);
        console.groupEnd();

        console.group('Coordinates');
          console.table({
            viewport: viewportArea,
            bounds: boundsArea,
            target: targetArea,
            delta: deltaArea
          });
        console.groupEnd();

        console.group('Deltas');
          console.log('delta area width:', expectedWidth);
          console.log('delta area height:', expectedHeight);
          console.log('bounds absolute area:', boundsArea);
          console.log('delta area:', deltaArea);
          console.log('delta in viewport:', deltaInViewport);
          console.log(`delta in bounds${isBoundsViewport ? ' (same)' : ''}:`, deltaInBounds);
        console.groupEnd();

        console.group('Horizontal visibility');
          console.log('current', deltaArea.width, '(HD) >=', expectedWidth, 'expected width');
          console.log('delta matches horizontally (X):', deltaMatches.byX);
        console.groupEnd();

        console.group('Vertical visibility');
          console.log('current', deltaArea.height, '(VD) >=', expectedHeight, 'expected height');
          console.log('delta matches vertically (Y):', deltaMatches.byY);
        console.groupEnd();
      console.groupEnd();
    });

    /* Compose a summary object */
    return {
      matches: deltaMatches.byX && deltaMatches.byY && deltaInViewport && deltaInBounds
    };
  }

  /**
   * Executes the given function only if debug mode is on.
   */
  debug(func: Function) {
    if (this.options.debug) func();
  }
}
