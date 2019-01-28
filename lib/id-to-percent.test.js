const idToPercent = require('./id-to-percent');

describe('id-to-percent', () => {
  it('converts Number ids to percentages (0.0-1.0)', () => {
    expect(idToPercent(1234)).toEqual(0.758999843792757);
  });
  it('converts String ids to percentages (0.0-1.0)', () => {
    expect(idToPercent('203989')).toEqual(0.8722318785433266);
  });
});
