/**
 * @flow
 * @summary Ensure given variable is encapsulated in the Array (and, therefore, iterable).
 */
export default function ensureArray(variable: Array<mixed> | mixed): Array<mixed> {
  /* Bypass arrays */
  if (Array.isArray(variable)) return variable;

  /* Convert array-like instance into actual array */
  if (variable instanceof HTMLCollection) return Array.from(variable);

  /* Otherwise, wrap in array */
  return [variable];
}
