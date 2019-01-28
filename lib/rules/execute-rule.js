const isString = require('lodash.isstring');
const getInputFromRule = require('./get-input-from-rule');
const executeRuleList = require('./execute-rule-list');
const executeRuleEqual = require('./execute-rule-equal');
const executeRulePercent = require('./execute-rule-percent');

function executeRule(input, rule, values) {
  const extractedInput = getInputFromRule(input, rule);
  if (!isString(extractedInput)) {
    // Can't execute rule if input was not found,
    // or it is not a string.
    // A missing input will skip rule execution
    // and either return the default value for that key,
    // or undefined if no default value is set.
    return;
  }
  switch (rule.type) {
    case 'list':
      return executeRuleList(extractedInput, rule, values);
    case 'equal':
      return executeRuleEqual(extractedInput, rule, values);
    case 'percent':
      return executeRulePercent(extractedInput, rule, values);
    default:
      throw new Error(`executeRule: rule.type not recognized: ${rule.type}`);
  }
}

module.exports = executeRule;
