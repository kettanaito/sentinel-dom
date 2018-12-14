import { Area } from './createArea'

export default function containsArea(
  area: Area,
  parentArea: Area,
  strict: boolean = true,
): boolean {
  return strict
    ? /**
       * Strict mode: resolve only when area is entirely present
       * within the parent.
       */
      parentArea.top <= area.top &&
        parentArea.right >= area.right &&
        parentArea.bottom >= area.bottom &&
        parentArea.left <= area.left
    : /* Weak mode: resolve when area is even partially visible within parent */
      area.left <= parentArea.right && area.top <= parentArea.bottom
}
