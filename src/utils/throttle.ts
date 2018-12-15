/**
 * Throttles the function for the provided threshold.
 */
export default function throttle(
  func: Function,
  threshold: number,
  scope?: any,
): EventListenerOrEventListenerObject {
  let last
  let deferTimer

  return function(...args: any[]) {
    const context = scope || this
    const now = +new Date()

    if (last && now < last + threshold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        func.apply(context, args)
      }, threshold + last - now)
    } else {
      last = now
      func.apply(context, args)
    }
  }
}
