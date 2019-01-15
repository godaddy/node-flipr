const executeRuleDefault = require('./execute-rule-default');

describe('execute-rule-default', () => {
  it('returns undefined if no default value', () => {
    expect(executeRuleDefault([
      { value: 1, someRule: 'a' },
    ])).toBe(undefined);
  });
  it('returns default value', () => {
    expect(executeRuleDefault([
      { value: 1, someRule: 'a' },
      { value: 2 },
    ])).toBe(2);
  });
});
