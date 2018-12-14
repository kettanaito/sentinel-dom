export interface Area {
  top: number
  right: number
  bottom: number
  left: number
  height: number
  width: number
}

interface AreaLikeObject {
  top: number
  right: number
  bottom: number
  left: number
}

type AreaSource = Window | HTMLElement | AreaLikeObject

const makeAbsolute = (area: Area) => {
  return Object.assign({}, area, {
    top: Math.floor(area.top + window.scrollY),
    right: Math.floor(area.right + window.scrollX),
    bottom: Math.floor(area.bottom + window.scrollY),
    left: Math.floor(area.left + window.scrollX),
  })
}

export default function createArea(
  source: AreaSource,
  useAbsoluteCoordinates: boolean = false,
): Area {
  let clientRect

  if (source === window) {
    clientRect = {
      top: window.scrollY,
      left: window.scrollX,
      height: window.innerHeight,
      width: window.innerWidth,
    }
  } else if (source instanceof HTMLElement) {
    clientRect = source.getBoundingClientRect()
  } else {
    clientRect = source
  }

  console.log({ source, clientRect })

  const area = {
    top: clientRect.top,
    right: clientRect.right || Math.floor(clientRect.left + clientRect.width),
    bottom: clientRect.bottom || Math.floor(clientRect.top + clientRect.height),
    left: clientRect.left,
    height: clientRect.height || Math.floor(clientRect.bottom - clientRect.top),
    width: clientRect.width || Math.floor(clientRect.right - clientRect.left),
  }

  return useAbsoluteCoordinates ? makeAbsolute(area) : area
}
