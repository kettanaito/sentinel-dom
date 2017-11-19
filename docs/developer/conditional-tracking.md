# Conditional tracking

## Introduction
Conditional tracking is a built-in algorithm which omits a target from being analyzed unless its `bounds` are visible in the current viewport.

## Motivation
When put simply, a target cannot be visible when its bounds are not visible. Therefore, there is no need to perform visibility analyzis at all.

## Benefits
* With conditional tracking, only the minimum of the analyzis logic is executed to verify the `bounds` visibility against the viewport.
* When you do not specify the custom `bounds`, the logic is analyzing a target relatively to the `window`, therefore, no conditional tracking is performed. It is recommended to provide the custom `bounds` when possible to improve a tracking performance.
* When the target element is not visible within the current viewport, no further analyzis is performed (i.e. offsets/edges/thresholds and delta areas intersections).

## How to use it?
Make sure to provide a custom `bounds` property when instantiating your Observer:

```js
new Observer({
  targets: document.getElementById('box'),
  bounds: document.getElementById('box-container'),
  ...
})
```

This will automatically enable conditional tracking, ensuring that unless `#box-container` element is visible, no unnecessary logic is being performed relatively to `#box` element.
