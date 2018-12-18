import { Area } from './createArea'

interface Edges {
  x: number
  y: number
}

/**
 * Determines if the given area contains the edges.
 * Edge represents an imaginary line drawn on the element's axis.
 */
export default function containsEdges(edges: Edges, area: Area): boolean {
  const { x, y } = edges
  const containsX = x ? x >= area.left && x <= area.right : true
  const containsY = y ? y >= area.top && y <= area.bottom : true

  return containsX && containsY
}
