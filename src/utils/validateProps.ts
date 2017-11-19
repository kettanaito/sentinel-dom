/**
 * Validate props.
 */
export default function validateProps(props: Object, rules: Object): void {
  Object.keys(rules).forEach((propName) => {
    const propValue = props[propName];
    const propRule = rules[propName];

    if (propRule.required) {
      if (!propValue) throw new Error(`Property "${propName}" is required, but was not found in the provided properties.`);
    }

    if (propValue) {
      const hasCustomRule = (typeof propRule.expect === 'function');
      const isValid = hasCustomRule ? propRule.expect(propValue) : (typeof propValue === propRule.expect);

      if (!isValid) {
        const receivedProp = `"${propValue}" (${typeof propValue})`;
        const errorMessage = propRule.message
          ? propRule.message({ propName, propValue, receivedProp })
          : `Expected property "${propName}" to be an instance of type ${propRule.expect}, but got: ${receivedProp}.`;

        throw new Error(errorMessage);
      }
    }
  });
}
