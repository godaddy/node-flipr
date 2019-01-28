const validateRule = require('./validate-rule');

const validRule = {
  type: 'equal',
  input: 'someProp',
  property: 'ruleProp',
};

describe('validate-rule', () => {
  it('does not throw for a valid rule', () => {
    expect(() => validateRule(validRule)).not.toThrow();
  });
  it('throws if rule does not have a type property', () => {
    const noType = { ...validRule };
    delete noType.type;
    expect(() => validateRule(noType)).toThrow();
  });
  it('throws if rule.type has an unexpected value', () => {
    expect(() => validateRule({
      ...validRule,
      type: 'not-a-valid-type',
    })).toThrow();
  });
  it('throws if rule does not have an input property', () => {
    const noInput = { ...validRule };
    delete noInput.input;
    expect(() => validateRule(noInput)).toThrow();
  });
  it('throws if rule.input is not a string or function', () => {
    expect(() => validateRule({
      ...validRule,
      input: true,
    })).toThrow();
  });
  it('throws if rule does not have a "property" property and is not type percent', () => {
    const noProperty = { ...validRule };
    delete noProperty.property;
    expect(() => validateRule(noProperty)).toThrow();
  });
  it('does not throw if rule does not have a "property" property and is type percent', () => {
    const noProperty = {
      ...validRule,
      type: 'percent',
    };
    delete noProperty.property;
    expect(() => validateRule(noProperty)).not.toThrow();
  });
});
