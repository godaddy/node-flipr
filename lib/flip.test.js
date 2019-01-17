const Flipr = require('./flipr');
const idToPercent = require('./id-to-percent');
const validateRule = require('./rules/validate-rule');

jest.mock('./id-to-percent');
jest.mock('./rules/validate-rule');

describe('Flipr', () => {
  describe('constructor', () => {
    it('throws if options.source is undefined', () => {
      expect(() => new Flipr()).toThrow();
    });
    it('throws if rules are invalid', () => {
      validateRule.mockImplementationOnce(() => { throw new Error(); });
      const options = {
        source: {},
        rules: ['not-valid'],
      };
      expect(() => new Flipr(options)).toThrow();
    });
  });
  describe('Flipr.idToPercent', () => {
    it('calls idToPercent', () => {
      Flipr.idToPercent('123');
      expect(idToPercent).toBeCalledWith('123');
    });
  });
  describe('Flipr.validateRules', () => {
    it('validates each rule provided', () => {
      Flipr.validateRules([1, 2, 3]);
      expect(validateRule).toHaveBeenCalledTimes(3);
    });
  });
  describe('preload', () => {
    it('does nothing if source does not have preload function', async () => {
      const flipr = new Flipr({ source: {} });
      await expect(async () => flipr.preload()).not.toThrow();
    });
    it('calls source\'s preload', async () => {
      const preload = jest.fn();
      const flipr = new Flipr({
        source: {
          preload,
        },
      });
      await flipr.preload();
      expect(preload).toHaveBeenCalled();
    });
  });
  describe('flush', () => {
    it('does nothing if source does not have flush function', async () => {
      const flipr = new Flipr({ source: {} });
      await expect(async () => flipr.flush()).not.toThrow();
    });
    it('calls source\'s flush', async () => {
      const flush = jest.fn();
      const flipr = new Flipr({
        source: {
          flush,
        },
      });
      await flipr.flush();
      expect(flush).toHaveBeenCalled();
    });
  });
  describe('getValue', () => {
    it('returns config value', async () => {
      const flipr = new Flipr({
        source: {
          async getConfig() {
            return {
              someKey: {
                value: 'someValue',
              },
            };
          },
        },
      });
      expect(await flipr.getValue('someKey')).toEqual('someValue');
    });
    it('returns undefined for a dynamic config value when no input is given', async () => {
      const flipr = new Flipr({
        source: {
          async getConfig() {
            return {
              someKey: {
                values: [
                  { value: 3, favoriteLetter: 'a' },
                  { value: 2, favoriteLetter: 'b' },
                  { value: 1 },
                ],
              },
            };
          },
        },
        rules: [
          {
            property: 'favoriteLetter',
            type: 'equal',
            input: 'myLetter',
          },
        ],
      });
      expect(await flipr.getValue('someKey')).toBe(undefined);
    });
    it('returns dynamic config value when given an input', async () => {
      const flipr = new Flipr({
        source: {
          async getConfig() {
            return {
              someKey: {
                values: [
                  { value: 3, favoriteLetter: 'a' },
                  { value: 2, favoriteLetter: 'b' },
                  { value: 1 },
                ],
              },
            };
          },
        },
        rules: [
          {
            property: 'favoriteLetter',
            type: 'equal',
            input: 'myLetter',
          },
        ],
      });
      expect(await flipr.getValue(
        'someKey',
        { myLetter: 'b' },
      )).toEqual(2);
    });
  });
  describe('getConfig', () => {
    it('returns static config', async () => {
      const flipr = new Flipr({
        source: {
          async getConfig() {
            return {
              someKey: {
                value: 'someValue',
              },
              otherKey: {
                values: [
                  { value: 2, favoriteLetter: 'a' },
                  { value: 1 },
                ],
              },
            };
          },
        },
      });
      expect(await flipr.getConfig()).toEqual({
        someKey: 'someValue',
      });
    });
    it('returns dynamic config when given an input', async () => {
      const flipr = new Flipr({
        source: {
          async getConfig() {
            return {
              someKey: {
                value: 'someValue',
              },
              otherKey: {
                values: [
                  { value: 2, favoriteLetter: 'a' },
                  { value: 1 },
                ],
              },
            };
          },
        },
        rules: [
          {
            property: 'favoriteLetter',
            type: 'equal',
            input: 'myLetter',
          },
        ],
      });
      expect(await flipr.getConfig({ myLetter: 'a' })).toEqual({
        someKey: 'someValue',
        otherKey: 2,
      });
    });
  });
});
