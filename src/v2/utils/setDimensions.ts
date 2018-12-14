import { Area } from './createArea'

interface Dimensions {
  height: number
  width: number
}

export default function setDimensions(
  nextDimensions: Dimensions,
  area: Area,
): Area {
  const nextHeight = nextDimensions.hasOwnProperty('height')
    ? nextDimensions.height
    : area.height
  const nextWidth = nextDimensions.hasOwnProperty('width')
    ? nextDimensions.width
    : area.width

  return Object.assign({}, area, {
    height: nextHeight,
    width: nextWidth,
    right: Math.floor(area.left + nextWidth),
    bottom: Math.floor(area.top + nextHeight),
  })
}
