/**
 * Ensures the given variable is encapsulated in the Array and, this, is iterable.
 */
export default function ensureArray(variable: any[] | any): any[] {
  /* Bypass arrays */
  if (Array.isArray(variable)) return variable;

  /* Convert array-like instance into actual array */
  if (variable instanceof HTMLCollection) return Array.from(variable);

  /* Otherwise, wrap in array */
  return [variable];
}
