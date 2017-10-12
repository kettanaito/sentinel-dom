# Usage with React

## Example
You can use `Tracker` just as you would in any other scenario. However, you need to declare the tracker **after** the mounting of the target component.

```js
import { Tracker } from 'sentinel-dom';

export default class SearchTile extends React.Component {
  componentDidMount() {
    new Tracker({
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

**ViewTracker.jsx**
```jsx
export default class ViewTracker extends React.Component {
  componentDidMount() {
    const { ...trackingOptions } = this.props;

    this.tracker = new Tracker({
      ...trackingOptions,
      targets: this.containerElement
    });
  }

  track = () => {
    if (!this.tracker) {
      throw new Error('Trying to manually track visibility before the ViewTracker is initialized.');
    }

    this.tracker.track();
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
import ViewTracker from './ViewTracker';

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
      <ViewTracker
        snapshots={[{
          thresholdY: 50,
          callback: this.handleVisibility
        }]}
        once>
        <div className="tile-container">
          {/* ... */}
        </div>
      </ViewTracker>
    );
  }
}
```
