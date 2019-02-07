const executeRuleEqual = require('./execute-rule-equal');

describe('execute-rule-equal', () => {
  it('returns undefined if no match is found', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRuleEqual('green', rule, [
      { value: 1, otherRule: 'a' },
      { value: 2, favoriteColor: 'blue' },
    ])).toBe(undefined);
  });
  it('returns value when input is matches rule', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRuleEqual('purple', rule, [
      { value: 1, favoriteColor: 'purple' },
    ])).toBe(1);
  });
  it('is case insensitive by default', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRuleEqual('purple', rule, [
      { value: 1, favoriteColor: 'PURPLE' },
    ])).toBe(1);
  });
  it('uses case sensitive match if rule is case sensitive', () => {
    const rule = {
      property: 'favoriteColor',
      isCaseSensitive: true,
    };
    expect(executeRuleEqual('black', rule, [
      { value: 1, favoriteColor: 'BLACK' },
    ])).toBe(undefined);
  });
});
