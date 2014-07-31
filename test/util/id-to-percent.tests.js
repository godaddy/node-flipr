'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/id-to-percent';
var sut = require(sutPath);

describe('id-to-percent', function(){
  it('converts Number ids to percentages (0.0-1.0)', function(){
    var result = sut(1234);
    expect(result).to.equal(0.758999843792757);
  });
  it('converts String ids to percentages (0.0-1.0)', function(){
    var result = sut('203989');
    expect(result).to.equal(0.8722318785433266);
  });
});