import throttle from './utils/throttle'
import takeSnapshot, { SnapshotOptions, SnapshotBounds } from './takeSnapshot'

interface ObserveOptions {
  elements: HTMLElement
  snapshots: {
    [snapshotName: string]: SnapshotOptions
  }
  throttle?: number
}

type ObserverEventCallback = (element: HTMLElement) => void

interface Observer {
  /**
   * Executes the given callback for the snapshot name
   * for the first time it occurs. Ignores any subsequent occurences.
   */
  once(snapshotName: string, callback: ObserverEventCallback)

  /**
   * Executes the given callback each time the snapshot resolves.
   */
  on(snapshotName: string, callback: ObserverEventCallback)
}

const defaultSnapshots = {
  visible: {},
}

export default function observe(options: ObserveOptions): Observer {
  const {
    elements,
    snapshots = defaultSnapshots,
    throttle: throttleThreshold,
  } = options

  this.callbackCounts = {}

  const applicableSnapshots = Object.entries(snapshots).reduce(
    (list, [snapshotName, snapshotOptions]) => {
      return list.concat(() => {
        /**
         * @todo Support HTMLCollection of `elements`.
         */
        if (takeSnapshot(elements, snapshotOptions)) {
          window.dispatchEvent(
            new CustomEvent('elementAppeared', { detail: { elements } }),
          )
        }
      })
    },
    [],
  )

  window.addEventListener(
    'scroll',
    throttle(
      () => applicableSnapshots.forEach((resolver) => resolver()),
      throttleThreshold || 200,
    ),
    false,
  )

  return {
    once: (snapshotName, callback) => {
      /**
       * @todo Lift up the listener part, so it doesn't repeat between `once` and `on`.
       */
      window.addEventListener('elementAppeared', (event: CustomEvent) => {
        if (!this.callbackCounts[snapshotName]) {
          callback(event.detail.elements)
          this.callbackCounts[snapshotName] = true
        }
      })

      return this
    },
    on: (snapshotName, callback) => {
      window.addEventListener('elementAppeared', (event: CustomEvent) => {
        callback(event.detail.elements)
        this.callbackCounts[snapshotName] = true
      })

      return this
    },
  }
}
