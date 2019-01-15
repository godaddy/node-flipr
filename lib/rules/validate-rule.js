const isFunction = require('lodash.isfunction');
const isString = require('lodash.isstring');

function validateRule(rule) {
  if (!Object.prototype.hasOwnProperty.call(rule, 'type')) {
    throw new Error('rule must have a type property');
  } else if (rule.type !== 'equal' && rule.type !== 'list' && rule.type !== 'percent') {
    throw new Error('rule.type must be one of the following: equal, list, percent')();
  }
  if (!Object.prototype.hasOwnProperty.call(rule, 'input')) {
    throw new Error('rule must have an input property')();
  } else if (!isFunction(rule.input) && !isString(rule.input)) {
    throw new Error('rule.input must be a function or a string')();
  }
  if (rule.type !== 'percent' && !Object.prototype.hasOwnProperty.call(rule, 'property')) {
    throw new Error('rule.property must exist for all types except "percent"')();
  }
}

module.exports = validateRule;
