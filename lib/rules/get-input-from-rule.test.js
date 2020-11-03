const getInputFromRule = require('./get-input-from-rule');

describe('get-input-from-rule', () => {
  it('returns undefined if input function throws', () => {
    const input = {};
    const rule = {
      input: () => { throw new Error(); },
    };
    expect(getInputFromRule(input, rule)).toBe(undefined);
  });
  it('returns input function result if input function is provided', () => {
    const input = { a: 1 };
    const rule = {
      input: (i) => i.a,
    };
    expect(getInputFromRule(input, rule)).toBe('1');
  });
  it('returns undefined if input does not have input path', () => {
    const input = {};
    const rule = {
      input: 'a',
    };
    expect(getInputFromRule(input, rule)).toBe(undefined);
  });
  it('returns input coalesced as a string using given input path', () => {
    const input = { a: 1 };
    const rule = {
      input: 'a',
    };
    expect(getInputFromRule(input, rule)).toBe('1');
  });
  it('returns input lower cased if rule is not case sensitive', () => {
    const input = { a: 'B' };
    const rule = {
      input: 'a',
    };
    expect(getInputFromRule(input, rule)).toBe('b');
  });
  it('returns input in original case if rule is case sensitive', () => {
    const input = { a: 'B' };
    const rule = {
      input: 'a',
      isCaseSensitive: true,
    };
    expect(getInputFromRule(input, rule)).toBe('B');
  });
});
