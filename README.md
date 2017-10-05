<p align="center">
  <a href="https://www.npmjs.com/package/sentinel-dom">
    <img src="https://img.shields.io/npm/v/sentinel-dom.svg" alt="NPM version" />
  </a>
</p>

<br>
<p align="center">
  <a href="https://github.com/kettanaito/sentinel-dom">
    <img src="./sentinel-logo.png" alt="Sentinel DOM" />
  </a>
</p>

<h1 align="center"><strong>Sentinel DOM</strong></h1>

## Introduction
**Sentinel DOM** is a library aimed to make visibility tracking of DOM elements easy and flexible. Althought it is designed primarily for analytics purposes, you may use it anywhere you need to determine element's visibility.

## Motivation
### Essential
* This library contains essential features which will cover frequently requested visibility tracking logic (unique impressions, visibility after certain point/action, percentage visibility, and much more).

### Reliable
* Small visibility logic snippets have [a few major drawbacks](./docs).
* The logic used in this library is *thoroughly tested* with both automated tests and continuous usage on production. Do more programming, less bug fixing.

### Fast
* This library uses built-in optimizations (i.e. throttling, [conditional tracking](./docs/conditional-tracking.md)) which ensure utmost performance in your project.

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
      name: 'Box is completely visible',
      callback({ DOMElement }) {
        DOMElement.classList.add('visible');
      }
    },
    {
      name: 'At least 50% of the box height is visible',
      thresholdY: 50,
      callback() { ... }
    }
  ]
});
```
You can change the tracking logic to suit your needs. See the [Options documentation](./docs/options.md) for all the features and the examples of how to use them.

## Contribution
Feel free to submit an issue or a pull request to make this library even better. Make sure to read the [Contribution guide](./CONTRIBUTING.md) to ensure unified workflow and quality of the repository. Thank you!
