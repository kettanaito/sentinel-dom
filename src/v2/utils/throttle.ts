export default function throttle(func: Function, threshold: number) {
  let last
  let deferTime

  return (...args: any[]) => {
    const now = +new Date()

    if (last && now < last + threshold) {
      clearTimeout(deferTime)
      deferTime = setTimeout(() => {
        last = now
        func.apply(this, args)
      }, threshold + last - now)
    } else {
      last = now
      func.apply(this, args)
    }
  }
}
