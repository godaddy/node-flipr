'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-config-by-rules/get-item-and-validate-values';

chai.use(sinonChai);

var asyncMock = mockAsync();
var lodashMock = mockLodash();
var sutProxy  = proxyquire(sutPath, {
  'async': asyncMock,
  'lodash': lodashMock,
  '../../config-reader/get-item-from-config': 'getItemFromConfig',
  '../validate-values': 'validateValues',
  '../../config-reader/get-values-from-item-safe': 'getValuesFromItemSafe',
  '../../util/end-waterfall-without-result': sinon.stub().returns('endWaterfallWithoutResult')
});

describe('get-item-and-validate', function(){
  it('calls waterfall with the correct steps', function(){
    sutProxy('somekey', 'someconfig', 'somecb');
    expect(asyncMock.waterfall).to.be.calledWithMatch([
      'getItemFromConfig',
      'getValuesFromItemSafe',
      'validateValues',
    ], 'endWaterfallWithoutResult');
    expect(lodashMock.partial).to.be.calledWith('getItemFromConfig', 'somekey', 'someconfig');
    expect(lodashMock.partial).to.be.calledWith('getValuesFromItemSafe');
    expect(lodashMock.partial).to.be.calledWith('validateValues', 'somekey');
  });
});

function mockAsync(){
  return {
    waterfall: sinon.spy()
  };
}

function mockLodash(){
  return {
    partial: sinon.spy(function(func){ return func; })
  };
}
