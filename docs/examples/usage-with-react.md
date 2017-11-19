# Usage with React

## Example
You can use `Observer` just as you would in any other scenario. However, you need to declare the `Observer` **after** the mounting of the target component.

```js
import { Observer } from 'sentinel-dom';

export default class SearchTile extends React.Component {
  componentDidMount() {
    new Observer({
      targets: this.DOMElement,
      snapshots: [
        {
          thresholdY: 50,
          callback: this.handleVisibility
        }
      ]
    });
  }

  handleVisibility = () => {
    const { productId } = this.props;

    /* Send dataLayer push */
    dataLayer.push({
      products: [{ productId }]
    });
  }

  render() {
    return (
      <div ref={DOMElement => this.DOMElement = DOMElement} className="tile-container">
        {/* ... */}
      </div>
    );
  }
}
```

## Abstraction
In some cases it would make sense to isolate the logic above into the context-free abstraction component, which would serve as a wrapper for tracking.

**ViewObserver.jsx**
```jsx
export default class ViewObserver extends React.Component {
  componentDidMount() {
    const { ...trackingOptions } = this.props;

    this.observer = new Observer({
      ...trackingOptions,
      targets: this.containerElement
    });
  }

  track = () => {
    if (!this.observer) {
      throw new Error('Trying to manually track visibility before the ViewObserver is initialized.');
    }

    this.observer.track();
  }

  render() {
    return (
      <div ref={containerElement => this.containerElement = containerElement}>
        { this.props.children }
      </div>
    );
  }
}
```

**Usage example:**
```jsx
import ViewObserver from './ViewObserver';

export default class SearchTile extends React.Component {
  handleVisibility = () => {
    const { productId } = this.props;

    /* Send dataLayer push */
    dataLayer.push({
      products: [{ productId }]
    });
  }

  render() {
    return (
      <ViewObserver
        snapshots={[{
          thresholdY: 50,
          callback: this.handleVisibility
        }]}
        once>
        <div className="tile-container">
          {/* ... */}
        </div>
      </ViewObserver>
    );
  }
}
```
