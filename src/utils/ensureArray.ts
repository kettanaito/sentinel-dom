export default function ensureArray(variable: any[] | any): any[] {
  return variable instanceof HTMLCollection
    ? Array.from(variable)
    : [].concat(variable)
}
