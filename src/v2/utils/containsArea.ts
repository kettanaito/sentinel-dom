import { Area } from './createArea'

/**
 * Determines if the given area lies within the given parent area.
 * @param childArea Area to test.
 * @param parentArea Area to test against.
 * @param strict Wheter `childArea` must lie entirely within `parentArea`.
 */
export default function containsArea(
  childArea: Area,
  parentArea: Area,
  strict: boolean = true,
): boolean {
  return strict
    ? /**
       * Strict mode: resolve only when area is entirely present
       * within the parent.
       */
      parentArea.top <= childArea.top &&
        parentArea.right >= childArea.right &&
        parentArea.bottom >= childArea.bottom &&
        parentArea.left <= childArea.left
    : /* Weak mode: resolve when area is even partially visible within parent */
      childArea.left <= parentArea.right && childArea.top <= parentArea.bottom
}
