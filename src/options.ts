import { TObserverOptions } from '../types/Observer';
import { validateOptions } from './utils';

export function hasValidOptions(options: TObserverOptions) {
  validateOptions(options, {
    targets: {
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
      expect: value => (
        value instanceof HTMLElement ||
        value === window
      ),
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
