const executeRule = require('./execute-rule');
const executeRuleDefault = require('./execute-rule-default');

function getValueByRules(input, rules, values) {
  if (input === undefined || values.length === 0) {
    return;
  }
  let result;
  // for loop for efficiency's sake here,
  // need custom early return
  for (let i = 0; i < rules.length; i += 1) {
    result = executeRule(input, rules[i], values);
    if (result !== undefined) {
      return result;
    }
  }
  // default rule is always processed last.
  return executeRuleDefault(values);
}

module.exports = getValueByRules;
