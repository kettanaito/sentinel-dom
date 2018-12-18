import throttle from './utils/throttle'
import takeSnapshot, { SnapshotOptions } from './takeSnapshot'

interface ObserveOptions {
  elements: HTMLElement | HTMLCollection
  bounds?: HTMLElement
  snapshots?: {
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
   * Executes the given callback any time the snapshot resolves.
   */
  on(snapshotName: string, callback: ObserverEventCallback)
}

const defaultSnapshots = {
  visible: {},
  appear: {
    pruneOnReject: true /** @todo Deprecate, not nice */,
    resolve(element, matches, prevState) {
      return matches && !prevState.includes(element)
    },
  },
}

export default function observe(options: ObserveOptions): Observer {
  const {
    elements,
    bounds,
    snapshots = defaultSnapshots,
    throttle: throttleThreshold,
  } = options

  this.state = {}

  /* Ensure elements are iterable, either a single element, or a collection */
  const iterableElements =
    elements instanceof HTMLCollection
      ? Array.from(elements)
      : [].concat(elements)

  const matchesQueue = Object.entries(snapshots).reduce(
    (list, [snapshotName, snapshotOptions]) => {
      return list.concat(() => {
        iterableElements.forEach((element) => {
          const snapshotMatches = takeSnapshot(element, {
            bounds,
            ...snapshotOptions,
          })

          const eventPayload = {
            element,
            snapshotName,
            snapshotOptions,
            matches: snapshotMatches,
          }

          window.dispatchEvent(
            new CustomEvent(snapshotName, {
              detail: eventPayload,
            }),
          )
        })
      })
    },
    [],
  )

  window.addEventListener(
    'scroll',
    throttle(
      () =>
        matchesQueue.forEach((checkSnapshotMatches) => checkSnapshotMatches()),
      throttleThreshold || 200,
    ),
    false,
  )

  const createEventHandler = createHandler.bind(this)

  return {
    once: createEventHandler(
      this.state,
      (snapshotState, element) => !snapshotState.includes(element),
    ),
    on: createEventHandler(this.state, () => true),
  }
}

type ObserverHandlerPredicate = (
  snapshotState: Object,
  element: HTMLElement,
  snapshotName: string,
) => boolean

function createHandler(state, predicate: ObserverHandlerPredicate) {
  return (snapshotName: string, callback: ObserverEventCallback) => {
    window.addEventListener(
      snapshotName,
      (event: CustomEvent) => {
        const {
          matches,
          element,
          snapshotName: resolvedSnapshotName,
          snapshotOptions,
        } = event.detail

        /* Short circuit on irrelevant snapshots */
        if (resolvedSnapshotName !== snapshotName) {
          return
        }

        if (!state[resolvedSnapshotName]) {
          state[resolvedSnapshotName] = []
        }

        const prevSnapshotState = state[resolvedSnapshotName]
        let nextSnapshotState = prevSnapshotState

        const shouldSnapshotResolve = snapshotOptions.resolve
          ? snapshotOptions.resolve(element, matches, prevSnapshotState)
          : matches

        if (
          shouldSnapshotResolve &&
          predicate(prevSnapshotState, element, snapshotName)
        ) {
          callback(element, resolvedSnapshotName, snapshotOptions)

          /* Update the snapshot state */
          nextSnapshotState = nextSnapshotState.includes(element)
            ? nextSnapshotState
            : nextSnapshotState.concat(element)
        }

        if (!matches && snapshotOptions.pruneOnReject) {
          nextSnapshotState = nextSnapshotState.filter((someElement) => {
            return someElement !== element
          })
        }

        state[resolvedSnapshotName] = nextSnapshotState
      },
      false,
    )

    return this
  }
}
