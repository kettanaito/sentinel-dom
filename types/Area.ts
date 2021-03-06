export type TAreaOptions = {
  absolute?: boolean // create an Area with absolute coordinates immediately
}

export type TContainOptions = {
  weak?: boolean // contain will resolve even if the child area partially lies with the parent
}

export type TContainsEdgeAxis = {
  x: number,
  y: number
}

export type TAreaLikeObject = {
  top: number,
  right: number,
  bottom: number,
  left: number
}
