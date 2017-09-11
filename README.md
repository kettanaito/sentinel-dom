# Sentinel

## Install
```
npm install --save-dev sentinel-dom
```

## Introduction
**Sentinel** is a visibility tracking library aimed to make the latter easy and flexible. Althought it is designed primarily for analytics purposes, you may use it anywhere you need to determine element's visibility.

## Getting started
### Basic usage
```js
import { Tracker } from 'sentinel-dom';

new Tracker({
  targets: document.getElementById('box'),
  snapshots: [
    {
      name: 'Box is visible',
      callback({ DOMElement }) {
        DOMElement.classList.add('visible');
      }
    }
  ]
});
```

### Custom snapshot options
You may declare multiple snapshots to be performed on the same targets/bounds. Each snapshot may have different visibility conditions (see [Snapshot options](./docs/02-options.md#snapshot-options).)
```js
new Tracker({
  targets: document.getElementsByClassName('article-content'),
  snapshots: [
    {
      name: 'Article has appeared',
      thresholdY: 10,
      callback() {
        console.log('Article content has appeared!');
      }
    },
    {
      name: 'Article is read',
      thresholdY: 90,
      callback() {
        console.log('Article content is read!');
      }
    }
  ]
});
```

## Contribution
Feel free to submit an issue or a pull request to make Sentinel even better.
