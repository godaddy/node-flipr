const Flipr = require('../lib/flipr');
const mockSource = require('./mock-source');

describe('includesListAll rule', () => {
  describe('handles input as string and', () => {
    it('matches config where rule prop is an array containing strings, and all strings are a substring of input', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'hjklp')).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'qASdf')).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'hJKlp')).toBe(3);
    });
  });
  describe('handles input as array and', () => {
    it('matches config where rule prop is an array containing strings, and all strings exist in input array', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['hj', 'jk', 'kl', 'lp'])).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['AS', 'sd', 'fg'])).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['AS', 'sd', 'fg'])).toBe(3);
    });
  });
  describe('handles input as object and', () => {
    it('matches config where rule prop is an array, and all strings exist in input object values', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'jk', bar: 'kl' })).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'AS', bar: 'sd' })).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAll',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'AS', bar: 'sd' })).toBe(3);
    });
  });
});
