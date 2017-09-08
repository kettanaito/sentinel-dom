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
    this.height = rect.height || rect.bottom - rect.top;
    this.width = rect.width || rect.right - rect.left;

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
  contains = (area: Area | Object, options: TContainOptions): boolean => {
    const { weak } = { ...defaultContainOptions, ...options };
    const parentRect = this;

    return weak ? (
      (area.left <= parentRect.right) && (area.top <= parentRect.bottom)
    ) : (
      (parentRect.top <= area.top) &&
      (parentRect.right >= area.right) &&
      (parentRect.bottom >= area.bottom) &&
      (parentRect.left <= area.left)
    );
  }

  intersect = (area: Area): Area => {
    /* When current area completely contains the provided area, return the area */
    if (this.contains(area)) return area;

    const areaPos = {
      top: (area.bottom < this.bottom) && (area.top < this.top),
      left: (area.right < this.right) && (area.left < this.left)
    };

    return new Area({
      top: areaPos.top ? this.top : area.top,
      right: areaPos.left ? area.right : this.left,
      bottom: areaPos.top ? this.bottom : area.bottom,
      left: areaPos.left ? this.left : area.left
    });
  }
}
