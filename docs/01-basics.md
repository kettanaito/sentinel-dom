# Basics
This article is meant to explain the basics of the functionality of the library.

## Terminology
To fully understand how this library works you would need to have a basic understanding of the terminology that is used during the explanations.

* *Target* - is a physical DOMElement which is being tracked.
* *Viewport* - self-explainatory; a current viewport of the page.
* *Bounds* (or *boundaries*) - is an imaginary rectangle within which the target is expected to appear.
* *Snapshot* - is a captured image of the boundaries within which the target is expected to appear.
* *Bleeding edge* - is a line within the client rectange of the target which should be matched by the viewport.

## Instantiating the tracking
In order to track a certain DOMElement on the page, you would need to provide the following options:
```js
const myDOMElement = document.getElementById('box');

new TrackingKit({
  targets: myDOMElement,
  snapshots: [
    {
      name: 'Box visibility',
      thresholdY: 80,
      callback({ DOMElement }) {
        console.log(`${DOMElement} has become visible!`);
      }
    }
  ]
});
```
Lets investigate what each of the provided options does:
* `targets` One or more DOMElements to track.
* `shapshots` A list of the snapshots to perform during the tracking.
  * `name` Snapshot name. Useful for debugging purposes.
  * `thresholdY` Percentage of the target's height to become visible to consider current snapshot successful. In our example, we state that the callback should fire only once 80% of the target's height becomes visible.
  * `callback` Function which is called when the snapshot is successful.

See all available [Options](./02-options.md) to gain the full power of tracking.

## Algorythm
This library uses a certain tracking algorythm to provide most efficient tracking of the elements.

1. Analyzes current positions of `bounds` and `viewport`. Position (`clientRect`) of the elements change under different circumstances (scrolling, animation). This is taken into account while performing the first stage of tracking.
1. Analyzes if `bounds` are visible within the current state of the `viewport`. It is impossible for the target to be visible when its bounds lie outside of the viewport. In this case the tracking is ignored and no further logic is performed.
1. Takes a series of `snapshots`. Each snapshot may have it own options (conditions) under which it is considered successful. A snapshot is performed as follows:
    1. Determines bleeding edges (horizontal and vertical) of the target. During this operation the options which affect the visibility (i.e. `offsetX`, `thresholdY`) affect the coordinates of the bleeding edges.
    1. Compare the bleeding edges toward the current bounds. Once the bleeding edge is within the boundaries respective coordinate, the edge is matched. Both horizontal and vertical bleeding edges must match in order for the snapshot to be successful.
1. Once successful snapshot is received, its callback function is being called. If the same snapshot becomes successful again, `once` option controls whether it should invoke its callback multiple times, or only once.
1. Algorythm is repeated under the provided throttling option.
