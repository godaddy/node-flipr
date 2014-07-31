'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-config-by-rules/get-item-and-validate';

chai.use(sinonChai);

var asyncMock = mockAsync();
var lodashMock = mockLodash();
var sutProxy  = proxyquire(sutPath, {
  'async': asyncMock,
  'lodash': lodashMock,
  '../../config-reader/get-item-from-config': 'getItemFromConfig',
  '../validate-config-item': 'validateConfigItem'
});

describe('get-item-and-validate', function(){
  it('calls waterfall with the correct steps', function(){
    sutProxy('somekey', 'someconfig', 'somecb');
    expect(asyncMock.waterfall).to.be.calledWithMatch([
      'getItemFromConfig',
      'validateConfigItem'
    ], 'somecb');
    expect(lodashMock.partial).to.be.calledWith('getItemFromConfig', 'somekey', 'someconfig');
    expect(lodashMock.partial).to.be.calledWith('validateConfigItem', 'somekey');
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
