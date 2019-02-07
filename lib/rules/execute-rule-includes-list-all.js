const includes = require('lodash.includes');
const prepForComparison = require('./prep-for-comparison');

function executeRuleIncludesListAll(input, rule, values) {
  const firstMatch = values.find((value) => {
    const propertyValues = value[rule.property];
    if (!Array.isArray(propertyValues)) {
      return;
    }
    const found = propertyValues.every((propertyValue) => {
      const pv = prepForComparison(propertyValue, rule);
      return includes(input, pv);
    });
    return !!found;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleIncludesListAll;
