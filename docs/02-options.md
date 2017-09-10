# Options
In order to take the full advantage of the options below, make sure you have read the [Basics](./01-basics.md) of the library. This will give you an overview of how the library works and what each option affects.

## Root options
### `targets: Array<DOMElement> | DOMElement`
One or mutliple DOMElements to be tracked.

### `bounds?: DOMElement`
Boundaries against which the tracking is performed.

**Default:** `window`

### `throttle?: Number`
Throttle amount between each tracking operation.

**Default:** `1000`

### `once?: Boolean`
Should each snapshot invoke its callback only once, after the first successful tracking. Setting this to `false` will trigger snapshot's callback function each time the target becomes visible within the bounds.

**Default:** `true`

### `snapshots: Array<Snapshot>`
A list of the snapshots to take per each tracking.

## Snapshot options
### `name?: String`
The name of the snapshot. Useful during the debugging.

### `offsetX?: Number`
The amount of horizontal offset (in **px**) which is added to the target's horizontal bleeding edge.

**Default:** `0`

### `offsetY?: Number`
The amount of vertical offset (in **px**) which is added to the target's vertical bleeding edge.

Lets say you would like for the target to become visible while there is still 100px left to scroll to its actual top coordinate. You can achieve this by providing `offsetY: -100`.

**Default:** `0`

> **NOTE:** If your tracking logic relies on the percentage of the target's width/height see `thresholdX`/`thresholdY` options respectively. Do **not** use offset option for this purpose.

### `thresholdX?: Number`
The percentage of the target's width to become visible in ordere to invoke the callback function.

**Default:** `100`

### `thresholdY?: Number`
The percentage of the target's height to become visible in ordere to invoke the callback function.

Lets say you would like to track the element only when at least 70% of its height is in the viewport. You can achieve this by setting `thresholdY: 70` on the snapshot.

**Default:** `100`

> **NOTE:** Treshold options **do not accept negative values**.

### `callback({ DOMElement }): Function`
Callback function which is called after the snapshot is considered successful (the target is visible within the bounds).

Callback function has the following arguments:
* `DOMElement: HTMLElement` DOM element of the tracked target.