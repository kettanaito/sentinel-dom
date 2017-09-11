import { validateProps } from './utils';

export function hasValidProps(props) {
  validateProps(props, {
    targets: {
      required: true,
      expect: (value) => {
        return (
          value instanceof HTMLCollection ||
          value instanceof HTMLElement ||
          Array.isArray(value)
        );
      },
      message: ({ propName, receivedProp }) => `Expected property "${propName}" to be an instance of HTMLElement, or an HTMLCollection, but got: ${receivedProp}.`
    },
    bounds: {
      expect: value => value instanceof HTMLElement,
      message: ({ propName, receivedProp }) => `Expected property "${propName}" to be an instance of HTMLElement, but got: ${receivedProp}.`
    },
    snapshots: {
      required: true,
      expect: value => Array.isArray(value),
      message: ({ propName, receivedProp }) => `Expected property "${propName}" to be an Array, but got: ${receivedProp}.`
    },
    throttle: { expect: 'number' },
    once: { expect: 'boolean' }
  });
}
