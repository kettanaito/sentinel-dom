import throttle from './utils/throttle'
import takeSnapshot, { SnapshotOptions, SnapshotBounds } from './takeSnapshot'

interface ObserveOptions {
  elements: HTMLElement
  snapshots: {
    [snapshotName: string]: SnapshotOptions
  }
  throttle?: number
}

type ObserverEventCallback = (
  element: HTMLElement,
  snapshotName: string,
  snapshotOptions: SnapshotOptions,
) => void

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

  const iterableElements =
    elements instanceof HTMLCollection
      ? Array.from(elements)
      : [].concat(elements)

  this.callbackCounts = {}

  const applicableSnapshots = Object.entries(snapshots).reduce(
    (list, [snapshotName, snapshotOptions]) => {
      return list.concat(() => {
        iterableElements.forEach((element) => {
          if (takeSnapshot(element, snapshotOptions)) {
            window.dispatchEvent(
              new CustomEvent(snapshotName, {
                detail: {
                  element,
                  snapshotName,
                  snapshotOptions,
                },
              }),
            )
          }
        })
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
      window.addEventListener(snapshotName, (event: CustomEvent) => {
        const {
          element,
          snapshotName: resolvedSnapshotName,
          snapshotOptions,
        } = event.detail
        if (!this.callbackCounts[snapshotName]) {
          callback(element, resolvedSnapshotName, snapshotOptions)

          /**
           * @todo
           * Do per element assignment. A single snapshot may have multiple elements.
           * "once" behavior must work per element, not per snapshot.
           */
          this.callbackCounts[resolvedSnapshotName] = true
        }
      })

      return this
    },
    on: (snapshotName, callback) => {
      window.addEventListener(snapshotName, (event: CustomEvent) => {
        const {
          element,
          snapshotName: resolvedSnapshotName,
          snapshotOptions,
        } = event.detail
        callback(element, resolvedSnapshotName, snapshotOptions)

        this.callbackCounts[resolvedSnapshotName] = true
      })

      return this
    },
  }
}
