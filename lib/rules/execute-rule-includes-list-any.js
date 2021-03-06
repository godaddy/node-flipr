const includes = require('lodash.includes');
const prepForComparison = require('./prep-for-comparison');

function executeRuleIncludesListAny(input, rule, values) {
  const firstMatch = values.find((value) => {
    const propertyValues = value[rule.property];
    if (!Array.isArray(propertyValues)) {
      return;
    }
    const found = propertyValues.some((propertyValue) => {
      const pv = prepForComparison(propertyValue, rule);
      return includes(input, pv);
    });
    return !!found;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleIncludesListAny;
