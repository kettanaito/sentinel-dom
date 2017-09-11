/**
 * Ensure snapshots' targets are iterable.
 */
import type { TSnapshot } from '../../types/Snapshot';
import ensureArray from './ensureArray';

export default function ensureSnapshotTargets(snapshots: Array<TSnapshot>): Array<TSnapshot> {
  return snapshots.map((snapshot: TSnapshot): TSnapshot => {
    const nextSnapshot: Object = Object.assign({}, snapshot);

    if (nextSnapshot.targets) {
      nextSnapshot.iterableTargets = ensureArray(nextSnapshot.targets);
    }

    return nextSnapshot;
  });
}
