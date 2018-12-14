import { Area } from './createArea'

interface Edges {
  x: number
  y: number
}

export default function containsEdges(edges: Edges, area: Area): boolean {
  const { x, y } = edges
  const containsX = x ? x >= area.left && x <= area.right : true
  const containsY = y ? y >= area.top && y <= area.bottom : true

  return containsX && containsY
}
