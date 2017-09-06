/**
 * @flow
 * Get ClientRect
 */
import type { TClientRect } from '../../types/ClientRect';

/**
 * @summary Ensures client rectangle has all required dimensions.
 * Sometimes the end ClientRect received by {HTMLElement.getBoundingClientRect} does not
 * contain "right" or "bottom". This method ensures the dimensions are present, since those
 * dimensions may be calculated from the data which is always present.
 */
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
