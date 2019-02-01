const includes = require('lodash.includes');
const prepForComparison = require('./prep-for-comparison');

function executeRuleIncludesListAny(input, rule, values) {
  const firstMatch = values.find((value) => {
    const property = value[rule.property];
    if (!Array.isArray(property)) {
      return;
    }
    const found = property.some((propertyValue) => {
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
