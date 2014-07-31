'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-config-by-rules/get-item-and-validate-values-by-rules';

chai.use(sinonChai);

var asyncMock = mockAsync();
var lodashMock = mockLodash();
var sutProxy  = proxyquire(sutPath, {
  'async': asyncMock,
  'lodash': lodashMock,
  '../../config-reader/get-item-from-config': 'getItemFromConfig',
  '../validate-values-by-rules/validate-values-by-rules': 'validateValuesByRules',
  '../../config-reader/get-values-from-item-safe': 'getValuesFromItemSafe',
  '../../util/end-waterfall-without-result': sinon.stub().returns('endWaterfallWithoutResult')
});

describe('get-item-and-validate', function(){
  it('calls waterfall with the correct steps', function(){
    sutProxy('somekey', 'somerules', 'someconfig', 'somecb');
    expect(asyncMock.waterfall).to.be.calledWithMatch([
      'getItemFromConfig',
      'getValuesFromItemSafe',
      'validateValuesByRules',
    ], 'endWaterfallWithoutResult');
    expect(lodashMock.partial).to.be.calledWith('getItemFromConfig', 'somekey', 'someconfig');
    expect(lodashMock.partial).to.be.calledWith('getValuesFromItemSafe');
    expect(lodashMock.partial).to.be.calledWith('validateValuesByRules', 'somekey', 'somerules');
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
