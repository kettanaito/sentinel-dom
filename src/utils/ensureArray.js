/* @flow */

/**
 * Ensure Array.
 * @summary Ensure given variable is encapsulated in the Array (and, therefore, iterable).
 */
export default function ensureArray(variable: Array<any> | any): Array<any> {
  return Array.isArray(variable) ? variable : Array.from(variable);
}
