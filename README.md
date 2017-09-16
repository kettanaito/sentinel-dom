<p align="center">
  <a href="https://github.com/kettanaito/sentinel-dom">
    <img src="https://img.shields.io/npm/v/sentinel-dom.svg" alt="NPM version" />
  </a>
</p>

<h1 align="center">Sentinel DOM</h1>

## Install
```
npm install --save-dev sentinel-dom
```

## Introduction
**Sentinel DOM** is a library aimed to make visibility tracking of DOM elements easy and flexible. Althought it is designed primarily for analytics purposes, you may use it anywhere you need to determine element's visibility.

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
      name: 'Box is visible',
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
Please see the [Options documentation](./docs/02-options.md) for all the features and how to use them.

## Contribution
Feel free to submit an issue or a pull request to make this library even better. Thank you!
