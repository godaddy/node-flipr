const objectPath = require('object-path');
const prepForComparison = require('./prep-for-comparison');

function executeRulePathEqual(input, rule, values) {
  const firstMatch = values.find((value) => {
    const property = value[rule.property];
    if (property === undefined || typeof property !== 'object') {
      return;
    }
    const keys = Object.keys(property);
    if (keys.length !== 1) {
      return;
    }
    const path = keys[0];
    let pathValue = property[path];
    pathValue = prepForComparison(pathValue, rule);
    return objectPath.get(input, path) === pathValue;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRulePathEqual;
