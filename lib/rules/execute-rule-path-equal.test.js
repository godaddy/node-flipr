const executeRulePathEqual = require('./execute-rule-path-equal');

describe('execute-rule-path-equal', () => {
  it('returns undefined if no match is found', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRulePathEqual({ my: { color: 'green' } }, rule, [
      { value: 1, otherRule: 'a' },
      { value: 2, favoriteColor: { 'your.color': 'blue' } },
    ])).toBe(undefined);
  });
  it('returns undefined if property is not a key/value', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRulePathEqual({ my: { color: 'green' } }, rule, [
      { value: 1, otherRule: 'a' },
      { value: 2, favoriteColor: {} },
    ])).toBe(undefined);
  });
  it('returns value when input is matches rule', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRulePathEqual({ my: { color: 'purple' } }, rule, [
      { value: 1, favoriteColor: { 'my.color': 'purple' } },
    ])).toBe(1);
  });
  it('is case insensitive by default', () => {
    const rule = {
      property: 'favoriteColor',
    };
    expect(executeRulePathEqual({ my: { color: 'purple' } }, rule, [
      { value: 1, favoriteColor: { 'my.color': 'PURPLE' } },
    ])).toBe(1);
  });
  it('uses case sensitive match if rule is case sensitive', () => {
    const rule = {
      property: 'favoriteColor',
      isCaseSensitive: true,
    };
    expect(executeRulePathEqual({ my: { color: 'black' } }, rule, [
      { value: 1, favoriteColor: { 'my.color': 'BLACK' } },
    ])).toBe(undefined);
  });
});
