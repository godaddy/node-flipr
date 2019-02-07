const executeRuleList = require('./execute-rule-list');

describe('execute-rule-list', () => {
  it('returns undefined if no match is found', () => {
    const rule = {
      property: 'shortlist',
    };
    expect(executeRuleList('abc', rule, [
      { value: 1, shortlist: ['xyz'] },
    ])).toBe(undefined);
  });
  it('ignores rule props that are not an array', () => {
    const rule = {
      property: 'shortlist',
    };
    expect(executeRuleList('abc', rule, [
      { value: 1, shortlist: 'abc' },
    ])).toBe(undefined);
  });
  it('returns value when input is in rule list', () => {
    const rule = {
      property: 'shortlist',
    };
    expect(executeRuleList('abc', rule, [
      { value: 1, shortlist: ['abc'] },
    ])).toBe(1);
  });
  it('is case insensitive by default', () => {
    const rule = {
      property: 'shortlist',
    };
    expect(executeRuleList('abc', rule, [
      { value: 1, shortlist: ['ABC'] },
    ])).toBe(1);
  });
  it('uses case sensitive match if rule is case sensitive', () => {
    const rule = {
      property: 'shortlist',
      isCaseSensitive: true,
    };
    expect(executeRuleList('abc', rule, [
      { value: 1, shortlist: ['ABC'] },
    ])).toBe(undefined);
  });
});
