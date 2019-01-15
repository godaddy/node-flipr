const getValueByRules = require('./get-value-by-rules');

const rules = [
  { type: 'equal', property: 'ruleA', input: 'a' },
  { type: 'equal', property: 'ruleB', input: 'b' },
  { type: 'equal', property: 'ruleC', input: 'c' },
];
const values = [
  {
    value: 1, ruleA: '10', ruleB: '11', ruleC: '12',
  },
  {
    value: 2, ruleA: '20', ruleB: '21', ruleC: '22',
  },
  {
    value: 3, ruleA: '30', ruleB: '31', ruleC: '32',
  },
  { value: 4 },
];


describe('get-value-by-rules', () => {
  it('returns undefined if values is empty', () => {
    expect(getValueByRules(null, null, [])).toBe(undefined);
  });
  it('returns the first non-undefined value found by a rule, skipping the remaining rules', () => {
    expect(getValueByRules({ a: 10 }, rules, values)).toBe(1);
    expect(getValueByRules({ a: 20, b: 11 }, rules, values)).toBe(2);
    expect(getValueByRules({ b: 31, c: 22 }, rules, values)).toBe(3);
  });
  it('returns the default if no rule matches are found', () => {
    expect(getValueByRules({}, rules, values)).toBe(4);
  });
});
