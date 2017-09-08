/**
 * @flow weak
 * Area
 * Area is an alias for native ClientRect with a few utility methods on top of it.
 */

type TContainOptions = {
  weak?: boolean
}

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
    this.height = rect.height;
    this.width = rect.width;

    return this;
  }

  /**
   * Convert relative client rectangle to the absolute one.
   * Achieved by adding current scroll position.
   */
  toAbsolute = (): Area => {
    this.top += window.scrollY;
    this.right += window.scrollX;
    this.bottom += window.scrollY;
    this.left += window.scrollX;

    return this;
  }

  /**
   * Check if current Area contains the given Area or coordinates object.
   */
  contains = (childRect: Area | Object, options: TContainOptions): boolean => {
    const { weak } = { ...defaultContainOptions, ...options };
    const parentRect = this;

    return (
      (childRect.left >= 0) && (childRect.top >= 0) &&
      (weak ? (
        childRect.left <= parentRect.right && childRect.top <= parentRect.bottom
      ) : (
        (childRect.left <= parentRect.right) && (childRect.left >= parentRect.left) &&
        (childRect.top <= parentRect.bottom) && (childRect.top >= parentRect.top)
      ))
    );
  }
}
