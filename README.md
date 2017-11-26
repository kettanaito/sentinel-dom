<p align="center">
  <a href="https://www.npmjs.com/package/sentinel-dom">
    <img src="https://img.shields.io/npm/v/sentinel-dom.svg" title="Published version" />
  </a>
  <a href="#">
    <img src="https://circleci.com/gh/kettanaito/sentinel-dom/tree/master.svg?style=shield" title="Build status" />
  </a>
  <a href="https://david-dm.org/kettanaito/sentinel-dom">
    <img src="https://david-dm.org/kettanaito/sentinel-dom/status.svg" title="Dependencies status" />
  </a>
  <a href="https://david-dm.org/kettanaito/sentinel-dom?type=dev" title="devDependencies status">
    <img src="https://david-dm.org/kettanaito/sentinel-dom/dev-status.svg" />
  </a>
</p>

<br>
<p align="center">
  <a href="https://github.com/kettanaito/sentinel-dom">
    <img src="./sentinel-logo.png" alt="Sentinel DOM" />
  </a>
</p>

<h1 align="center"><strong>Sentinel DOM</strong></h1>
<p align="center">Predictable, flexible and easy visibility tracking of DOM elements.</p>

## Why?
### Why should I use this library if there are small snippets to track DOM elements' visibility?
When those snippets are enough for your project's needs - by all means, *use* them and don't overcomplicate your implementation.

From my practice those 10-15 lines of code are not sufficient to provide [unique impressions](./docs/options.md#unique-snapshots), [visibility after certain point](./docs/options.md#bleeding-edges) or [percentage visibility](./docs/options.md#thresholds). Those are vital things commonly shared between different visibility tracking requirements (such as Google Analytics implementation).  Sounds good to be put into a single library and work out of the box.

### Why not just use IntersectionObserver?
While this is a promising technology, [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is still experimental and shouldn't be relied on without a polyfill. Sentinel DOM uses VanillaJS under its hood (simple numbers comparison), and doesn't rely on experimental features, which results into vast browser support and reliability. It also has much more simple API than the IO (opinionated).

### Why should I add another dependency to my project?
In case you are looking for a reliable, stable and thoroughly tested solution, having Sentinel as a dependency is a small trade off.

This library also comes with a built-in performance optimizations (i.e. [conditional tracking](./docs/developer/conditional-tracking.md)) which have proven themselves worthy in the production run.

## Install
```
npm install --save sentinel-dom
```

## Getting started
Import the library in your project:
```js
const Observer = require('sentinel-dom').Observer;
```

Alternatively, with ES6+:
```js
import { Observer } from 'sentinel-dom';
```

And declare an Observer:
```js
new Observer({
  targets: document.getElementById('box'),
  snapshots: [
    {
      callback({ DOMElement }) {
        console.log(`${DOMElement} is completely visible`);
      }
    },
    {
      thresholdY: 25,
      callback({ DOMElement }) {
        console.log(`At least 25% of ${DOMElement} height is visible`);
      }
    }
  ]
});
```
That's it! Sentinel will now track the provided `targets` matching those `snapshots` using a performant, omni-directional tracking algorithm.

### Options and featues
There is much more to that. Thresholds, offsets, bleeding edges, manual tracking and much more can be configured at your will, whenever you need it.

Learn more about all available options and features in the [Official documentation](./docs/options.md).

## Concept
The main concept behind Sentinel is an ability to take multiple tracking attempts of the provided target(s) at the same time. Those attempts are refered to as `snapshots` and allow you to define different tracking logic against the same targets/bounds.

Learn more how Sentinel works under the hood from the [Developer documentation](./docs/developer).

## Contribution
Feel free to submit an issue or a pull request to make this library even better. Make sure to read the [Contribution guide](./.github/CONTRIBUTING.md) to ensure unified workflow and quality of the repository. Thank you!
