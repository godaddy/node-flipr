const prepForComparison = require('./prep-for-comparison');

function executeRuleList(input, rule, values) {
  const firstMatch = values.find((value) => {
    const propertyValues = value[rule.property];
    if (!Array.isArray(propertyValues)) {
      return;
    }
    const found = propertyValues.find((propertyValue) => {
      const pv = prepForComparison(propertyValue, rule);
      return pv === input;
    });
    return !!found;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleList;
