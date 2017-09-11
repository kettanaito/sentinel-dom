/**
 * @flow
 * Throttle.
 */
export default function throttle(func: Function, threshold: number, scope?: mixed): Function {
  let last;
  let deferTimer;

  return function (...args: Array<mixed>) {
    const context = scope || this;
    const now = +new Date();

    if (last && now < last + threshold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        func.apply(context, args);
      }, threshold + last - now);
    } else {
      last = now;
      func.apply(context, args);
    }
  };
}
