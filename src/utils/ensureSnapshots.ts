/**
 * Ensure snapshots' targets are iterable.
 */
import { TObserverOptions } from '../../types/Observer';
import { TSnapshot } from '../../types/Snapshot';
import isset from './isset';
import ensureArray from './ensureArray';

/* List of required snapshot options */
export const requiredOptions = [
  'offsetX',
  'offsetY',
  'thresholdY',
  'thresholdY',
  'edgeX',
  'edgeY'
];

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
