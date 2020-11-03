const isString = require('lodash.isstring');
const isBoolean = require('lodash.isboolean');
const isNumber = require('lodash.isnumber');
const isObject = require('lodash.isobject');

function prepForComparison(value, rule, recursive = false) {
  let coercedValue = value;
  // coerce boolean/number/string to string, lowercase if case insensitive rule
  if (isBoolean(coercedValue) || isNumber(coercedValue) || isString(coercedValue)) {
    coercedValue = String(coercedValue);
    if (!rule.isCaseSensitive) {
      coercedValue = coercedValue.toLowerCase();
    }
  } else if (!recursive) {
    // if we're not in a recursive call then prep array/object values for comparison
    if (Array.isArray(coercedValue)) {
      coercedValue = coercedValue.map((val) => prepForComparison(val, rule, true));
    } else if (isObject(coercedValue)) {
      coercedValue = Object.keys(coercedValue).reduce((memo, key) => ({
        ...memo,
        [key]: prepForComparison(coercedValue[key], rule, true),
      }), {});
    }
  }
  return coercedValue;
}

module.exports = prepForComparison;
