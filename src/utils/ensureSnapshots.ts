import { TObserverOptions } from '../../types/Observer';
import { TSnapshot } from '../../types/Snapshot';
import { isset, ensureArray } from '../utils';

/* List of the required snapshot options */
export const requiredOptions = [
  'offsetX',
  'offsetY',
  'thresholdY',
  'thresholdY',
  'edgeX',
  'edgeY'
];

/**
 * Ensures the targets of the given snapshots collection are iterable.
 * Uses a fallback Object for missing snapshot options.
 */
export default function ensureSnapshots(snapshots: TSnapshot[], fallbacks: TObserverOptions): TSnapshot[] {
  return snapshots.map((snapshot: TSnapshot): TSnapshot => {
    const nextSnapshot: TSnapshot = Object.assign({}, snapshot);

    /* Ensure snapshot targets are iterable (when present) */
    if (nextSnapshot.targets) {
      nextSnapshot.iterableTargets = ensureArray(nextSnapshot.targets);
    }

    /* Ensure all the required options are set */
    requiredOptions.forEach((optionName) => {
      const hasOption = Object.prototype.hasOwnProperty.call(snapshot, optionName);
      const fallbackOption = fallbacks[optionName];

      if (!hasOption && isset(fallbackOption)) {
        nextSnapshot[optionName] = fallbackOption;
      }
    });

    return nextSnapshot;
  });
}
