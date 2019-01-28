function executeRuleList(input, rule, values) {
  const firstMatch = values.find((value) => {
    const propertyValues = value[rule.property];
    if (!Array.isArray(propertyValues)) {
      return;
    }
    const found = propertyValues.find((propertyValue) => {
      const pv = String(propertyValue);
      return rule.isCaseSensitive
        ? pv === input
        : pv.toLowerCase() === input;
    });
    return !!found;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleList;
