<p align="center">
  <a href="https://www.npmjs.com/package/sentinel-dom">
    <img src="https://img.shields.io/npm/v/sentinel-dom.svg" alt="NPM version" />
  </a>
  <a href="#">
    <img src="https://circleci.com/gh/kettanaito/sentinel-dom/tree/master.svg?style=shield" alt="Build status" />
  </a>
  <a href="https://david-dm.org/kettanaito/sentinel-dom">
    <img src="https://david-dm.org/kettanaito/sentinel-dom/status.svg" alt="Dependencies status" />
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

## Motivation
| Features | Reliability | Performance |
| --- | --- | --- |
| This library ships with the essential features frequently requested in visibility tracking logic ([unique impressions](./docs/options.md#unique-snapshots), [visibility after certain point](./docs/options.md#bleeding-edges), [percentage visibility](./docs/options.md#thresholds), and [much more](./docs/options.md)). | Random visibility logic snippets have [a few major drawbacks](./docs). The logic used in this library is *thoroughly tested* with both automated tests and continuous usage on production. Do more programming, less bug fixing. | Built-in optimizations (i.e. throttling, [conditional tracking](./docs/conditional-tracking.md)) which ensure utmost performance in your project. |

## Install
```
npm install --save-dev sentinel-dom
```

## Getting started
Import the library in your project:
```js
import { Tracker } from 'sentinel-dom';
```

And declare a new tracker:
```js
new Tracker({
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
You can change the tracking logic to suit your needs. See the [Options documentation](./docs/options.md) for all the features and the examples of how to use them.

## Contribution
Feel free to submit an issue or a pull request to make this library even better. Make sure to read the [Contribution guide](./.github/CONTRIBUTING.md) to ensure unified workflow and quality of the repository. Thank you!
