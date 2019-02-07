const isFunction = require('lodash.isfunction');
const isString = require('lodash.isstring');

const ruleTypes = [
  'equal',
  'list',
  'percent',
  'includes',
  'includesListAny',
  'includesListAll',
];

function validateRule(rule) {
  if (!Object.prototype.hasOwnProperty.call(rule, 'type')) {
    throw new Error('rule must have a type property');
  } else if (!ruleTypes.includes(rule.type)) {
    throw new Error(`rule.type must be one of the following:
      ${ruleTypes.join('\n  ')}
    `);
  }

  if (!Object.prototype.hasOwnProperty.call(rule, 'input')) {
    throw new Error('rule must have an input property');
  } else if (!isFunction(rule.input) && !isString(rule.input)) {
    throw new Error('rule.input must be a function or a string');
  }

  if (
    rule.type !== 'percent'
    && !Object.prototype.hasOwnProperty.call(rule, 'property')
  ) {
    throw new Error('rule.property must exist for all types except "percent"');
  }
}

module.exports = validateRule;
