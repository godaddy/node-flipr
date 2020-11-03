const executeRule = require('./execute-rule');
const getInputFromRule = require('./get-input-from-rule');
const executeRuleList = require('./execute-rule-list');
const executeRuleEqual = require('./execute-rule-equal');
const executeRulePathEqual = require('./execute-rule-path-equal');
const executeRulePercent = require('./execute-rule-percent');

jest.mock('./get-input-from-rule');
jest.mock('./execute-rule-list');
jest.mock('./execute-rule-equal');
jest.mock('./execute-rule-path-equal');
jest.mock('./execute-rule-percent');

describe('execute-rule', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('returns undefined if extracted input is not a string', () => {
    getInputFromRule.mockReturnValue(undefined);
    expect(executeRule()).toBe(undefined);
  });
  it('throws if rule.type is not recognized', () => {
    getInputFromRule.mockReturnValue('someVal');
    expect(() => executeRule({}, { type: 'not-valid' })).toThrow();
  });
  it('returns executeRuleList for list rule', () => {
    const rule = {
      type: 'list',
    };
    getInputFromRule.mockReturnValue('someVal');
    executeRuleList.mockReturnValue('asdf');
    expect(executeRule(null, rule)).toBe('asdf');
  });
  it('returns executeRuleEqual for equal rule', () => {
    const rule = {
      type: 'equal',
    };
    getInputFromRule.mockReturnValue('someVal');
    executeRuleEqual.mockReturnValue('xyz');
    expect(executeRule(null, rule)).toBe('xyz');
  });
  it('returns executeRulePathEqual for pathEqual rule', () => {
    const rule = {
      type: 'pathEqual',
    };
    getInputFromRule.mockReturnValue('someVal');
    executeRulePathEqual.mockReturnValue('blah');
    expect(executeRule(null, rule)).toBe('blah');
  });

  it('returns executeRulePercent for percent rule', () => {
    const rule = {
      type: 'percent',
    };
    getInputFromRule.mockReturnValue('someVal');
    executeRulePercent.mockReturnValue('123');
    expect(executeRule(null, rule)).toBe('123');
  });
});
