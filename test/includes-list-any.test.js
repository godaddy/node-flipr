const Flipr = require('../lib/flipr');
const mockSource = require('./mock-source');

describe('includesListAny rule', () => {
  describe('handles input as string and', () => {
    it('matches config where rule prop is an array containing strings, and at least one string is a substring of input', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'dfjkiu')).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'dfASer')).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'dfJKiu')).toBe(3);
    });
  });
  describe('handles input as array and', () => {
    it('matches config where rule prop is an array containing strings, and at least one string exists in input array', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['hj', 'jk'])).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['AS', 'er'])).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['AS', 'er'])).toBe(3);
    });
  });
  describe('handles input as object and', () => {
    it('matches config where rule prop is an array, and at least one string exists in input object values', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'jk', bar: 'er' })).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'AS', bar: 'er' })).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: ['as', 'sd'], value: 1 },
        { ruleProp: ['jk', 'kl'], value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includesListAny',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'AS', bar: 'er' })).toBe(3);
    });
  });
});
