function executeRuleEqual(input, rule, values) {
  const firstMatch = values.find((value) => {
    let property = value[rule.property];
    if (property === undefined) {
      return;
    }
    property = String(property);
    return rule.isCaseSensitive
      ? property === input
      : property.toLowerCase() === input;
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleEqual;
