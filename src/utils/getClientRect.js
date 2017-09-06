/**
 * @flow
 * Get ClientRect
 */
import type { TClientRect } from '../../types/ClientRect';

export function getClientRect(element: HTMLElement): TClientRect {
  const rect: ClientRect = element.getBoundingClientRect();

  return {
    top: rect.top,
    right: rect.right || rect.left + rect.width,
    bottom: rect.bottom || rect.top + rect.height,
    left: rect.left,
    height: rect.height,
    width: rect.width
  };
}
