/**
 * @flow
 * Area
 * Area is a helper class built on top of native ClientRect with a few useful methods.
 */
import type { TContainOptions } from '../types/Area';

const defaultContainOptions = {
  weak: false
};

export default class Area {
  top: number;
  right: number;
  bottom: number;
  left: number;
  height: number;
  width: number;

  constructor(pointer: window | HTMLElement | Object): Area {
    let rect;

    if (pointer === window) {
      rect = {
        top: window.scrollY,
        left: window.scrollX,
        height: window.innerHeight || window.documentElement.clientHeight,
        width: window.innerWidth || window.documentElement.clientWidth
      };
    } else if (pointer instanceof HTMLElement) {
      rect = pointer.getBoundingClientRect();
    } else {
      rect = pointer;
    }

    /* Assign client rectangle properties */
    this.top = rect.top;
    this.right = rect.right || rect.left + rect.width;
    this.bottom = rect.bottom || rect.top + rect.height;
    this.left = rect.left;

    /* Ensure dimensions */
    this.height = rect.height || this.bottom - this.top;
    this.width = rect.width || this.right - this.left;

    return this;
  }

  /**
   * Get only client rectangle of the area.
   */
  getClientRect = (): Object => {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
      height: this.height,
      width: this.width
    };
  }

  /**
   * Compose a new Area based on the current one, which takes scroll position into account
   * when calculating its coordinates. Explicitly returns a new instance of Area to prevent
   * unexpected mutations of the values of the original (source) Area.
   */
  toAbsolute = (): Area => {
    return new Area({
      top: this.top + window.scrollY,
      right: this.right + window.scrollX,
      bottom: this.bottom + window.scrollY,
      left: this.left + window.scrollX
    });
  }

  /**
   * Check if current area contains the given area or coordinates object.
   */
  contains = (area: Area | Object, options?: TContainOptions): boolean => {
    const { weak } = { ...defaultContainOptions, ...options };
    const parentArea: Area = this;

    return weak ? (
      /**
       * Weak mode means that the provided area should not necessarily be in the parent
       * rectangle completely. Even partial presence will resolve.
       */
      (area.left <= parentArea.right) && (area.top <= parentArea.bottom)
    ) : (
      /**
       * Strong (default) mode, on the other hand, means that the area should completely lie
       * within the parent rectangle. Only then it should resolve.
       */
      (parentArea.top <= area.top) &&
      (parentArea.right >= area.right) &&
      (parentArea.bottom >= area.bottom) &&
      (parentArea.left <= area.left)
    );
  }

  /**
   * Get the intersection area between the current area and the provided one.
   */
  intersect = (area: Area): Area => {
    /* When current area completely contains the provided area, return the area */
    if (this.contains(area)) return area;

    /**
     * Area position.
     * To properly calculate intersection, it is needed to handle 4 different scenarios of
     * the area position:
     *
     * - area lies completely within the parent rectangle
     * - area's bottom - within, while top part - beyond
     * - area's top - within, while bottom part - beyond
     * - area's right - within, while left part - beyond
     * - area's left - within, while the right part - beyond
     *
     * In each of these scenarios coordinates of the intersected area will be inherited from
     * a different source (area or parent rectangle).
     */
    const areaPos = {
      left: (area.right < this.right) && (area.left < this.left),
      above: (area.bottom < this.bottom) && (area.top < this.top),
      within: {
        x: (area.left > this.left) && (area.right < this.right),
        y: (area.top > this.top) && (area.bottom < this.bottom)
      }
    };

    return new Area({
      top: areaPos.above ? this.top : area.top,
      right: (areaPos.left || areaPos.within.x) ? area.right : this.right,
      bottom: (areaPos.above || areaPos.within.y) ? area.bottom : this.bottom,
      left: areaPos.left ? this.left : area.left
    });
  }
}