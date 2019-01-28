const isFunction = require('lodash.isfunction');
const isString = require('lodash.isstring');
const isBoolean = require('lodash.isboolean');
const isNumber = require('lodash.isnumber');
const objectPath = require('object-path');

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

  if (!isString(result) && !isBoolean(result) && !isNumber(result)) {
    return;
  }

  result = String(result);

  if (!rule.isCaseSensitive) {
    result = result.toLowerCase();
  }

  return result;
}

module.exports = getInputFromRule;
