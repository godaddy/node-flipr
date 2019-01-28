const idToPercent = require('../id-to-percent');

/* eslint no-nested-ternary: 0 */
function sortValuesByPercentAscending(ruleProperty, values) {
  return values.sort((a, b) => {
    const aPercent = a[ruleProperty] || 0;
    const bPercent = b[ruleProperty] || 0;
    return aPercent < bPercent
      ? -1
      : aPercent === bPercent
        ? 0
        : 1;
  });
}

function executeRulePercent(input, rule, values) {
  const inputPercent = idToPercent(input);
  const ruleProperty = rule.property || 'percent';
  const sortedValues = sortValuesByPercentAscending(ruleProperty, values);
  /* eslint no-param-reassign: 0 */
  const match = sortedValues.reduce((memo, value) => {
    if (memo.found) {
      return memo;
    }
    const percent = (value[ruleProperty] || 0) / 100;
    memo.accumulatedPercent += percent;
    if (inputPercent <= memo.accumulatedPercent) {
      memo.found = value;
    }
    return memo;
  }, {
    accumulatedPercent: 0.0,
    found: null,
  });

  if (match.found) {
    return match.found.value;
  }
}

module.exports = executeRulePercent;
