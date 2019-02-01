const getInputFromRule = require('./get-input-from-rule');
const executeRuleList = require('./execute-rule-list');
const executeRuleEqual = require('./execute-rule-equal');
const executeRulePercent = require('./execute-rule-percent');
const executeRuleIncludes = require('./execute-rule-includes');
const executeRuleIncludesListAny = require('./execute-rule-includes-list-any');
const executeRuleIncludesListAll = require('./execute-rule-includes-list-all');

function executeRule(input, rule, values) {
  const extractedInput = getInputFromRule(input, rule);
  if (extractedInput === undefined) {
    // Can't execute rule if input was not found.
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
    case 'includes':
      return executeRuleIncludes(extractedInput, rule, values);
    case 'includesListAny':
      return executeRuleIncludesListAny(extractedInput, rule, values);
    case 'includesListAll':
      return executeRuleIncludesListAll(extractedInput, rule, values);
    default:
      throw new Error(`executeRule: rule.type not recognized: ${rule.type}`);
  }
}

module.exports = executeRule;
