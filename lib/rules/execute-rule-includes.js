const includes = require('lodash.includes');
const prepForComparison = require('./prep-for-comparison');

function executeRuleIncludes(input, rule, values) {
  const firstMatch = values.find((value) => {
    let property = value[rule.property];
    if (property === undefined) {
      return;
    }
    property = prepForComparison(property, rule);
    return includes(input, property);
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleIncludes;
