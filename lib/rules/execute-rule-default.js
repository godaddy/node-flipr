function executeRuleDefault(values) {
  const firstMatch = values.find((value) => {
    const keys = Object.keys(value);
    return keys.length === 1 && keys[0] === 'value';
  });
  if (firstMatch) {
    return firstMatch.value;
  }
}

module.exports = executeRuleDefault;
