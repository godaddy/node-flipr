const executeRulePercent = require('./execute-rule-percent');
const idToPercent = require('../id-to-percent');

jest.mock('../id-to-percent');

describe('execute-rule-percent', () => {
  it('returns undefined if no values match rule', () => {
    const input = 'abc';
    const rule = {};
    const values = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ];
    expect(executeRulePercent(input, rule, values)).toBe(undefined);
  });
  it('returns expected values based on id percentage', () => {
    const rule = {};
    const values = [
      { value: 2, percent: 20 },
      { value: 1, percent: 15 },
      { value: 3, percent: 65 },
    ];
    idToPercent.mockReturnValueOnce(0.15);
    expect(executeRulePercent(null, rule, values)).toBe(1);
    idToPercent.mockReturnValueOnce(0.35);
    expect(executeRulePercent(null, rule, values)).toBe(2);
    idToPercent.mockReturnValueOnce(0.36);
    expect(executeRulePercent(null, rule, values)).toBe(3);
  });
});
