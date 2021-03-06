const prepForComparison = require('./prep-for-comparison');

function executeRuleEqual(input, rule, values) {
  const firstMatch = values.find((value) => {
    let property = value[rule.property];
    if (property === undefined) {
      return;
    }
    property = prepForComparison(property, rule);
    return property === input;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleEqual;
