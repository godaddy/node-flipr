const isFunction = require('lodash.isfunction');
const objectPath = require('object-path');
const prepForComparison = require('./prep-for-comparison');

function getInputFromRule(input, rule) {
  let result;
  if (isFunction(rule.input)) {
    try {
      result = rule.input(input);
    } catch (e) {
      // Don't allow a bad input extraction to break config generation.
      // Ideally, all errors should be handled inside input function.
    }
  } else {
    result = objectPath.get(input, rule.input);
  }

  return prepForComparison(result, rule);
}

module.exports = getInputFromRule;
