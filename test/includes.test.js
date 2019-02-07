const Flipr = require('../lib/flipr');
const mockSource = require('./mock-source');

describe('includes rule', () => {
  describe('handles input as string and', () => {
    it('matches config where rule prop is a substring of input', async () => {
      const source = mockSource([
        { ruleProp: 'sd', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'hjkl')).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: 'sd', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'ASDF')).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: 'sd', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', 'ASDF')).toBe(3);
    });
  });
  describe('handles input as array and', () => {
    it('matches config where rule prop exists in input', async () => {
      const source = mockSource([
        { ruleProp: 'sd', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['as', 'jk'])).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: 'sd', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['as', 'SD'])).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: 'sd', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', ['as', 'JK'])).toBe(3);
    });
    it('coerces input array values to strings for comparison', async () => {
      const source = mockSource([
        { ruleProp: '34', value: 1 },
        { ruleProp: 'jk', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', [34, 'as'])).toBe(1);
    });
  });
  describe('handles input as object and', () => {
    it('matches config where rule prop exists as a value in input object', async () => {
      const source = mockSource([
        { ruleProp: 'ok', value: 1 },
        { ruleProp: 'bar', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'bar' })).toBe(2);
    });
    it('is case insensitive by default', async () => {
      const source = mockSource([
        { ruleProp: 'ok', value: 1 },
        { ruleProp: 'bar', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: 'OK' })).toBe(1);
    });
    it('is optionally case sensitive', async () => {
      const source = mockSource([
        { ruleProp: 'ok', value: 1 },
        { ruleProp: 'bar', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
        isCaseSensitive: true,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey',  { foo: 'BAR' })).toBe(3);
    });
    it('does a shallow check on the input object', async () => {
      const source = mockSource([
        { ruleProp: 'ok', value: 1 },
        { ruleProp: 'bar', value: 2 },
        { value: 3 },
      ]);
      const rules = [{
        type: 'includes',
        property: 'ruleProp',
        input: input => input,
      }]
      const flipr = new Flipr({source,rules});
      expect(await flipr.getValue('someKey', { foo: { nested: 'bar' } })).toBe(3);
    });
  });
});
