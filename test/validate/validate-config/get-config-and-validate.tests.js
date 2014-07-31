'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-config/get-config-and-validate';

chai.use(sinonChai);

var asyncMock = mockAsync();
var lodashMock = mockLodash();
var sutProxy  = proxyquire(sutPath, {
  'async': asyncMock,
  'lodash': lodashMock,
  '../../get-config/get-config': {
    ignoreCache: 'ignoreCache'
  },
  '../validate-config-by-rules/validate-config-by-rules': 'validateConfigByRules'
});

describe('get-config-and-validate', function(){
  it('calls waterfall with the correct steps', function(){
    var options = {
      rules: ['somerule']
    };
    sutProxy(options, 'somecb');
    expect(asyncMock.waterfall).to.be.calledWithMatch([
      'ignoreCache',
      'validateConfigByRules'
    ], 'somecb');
    expect(lodashMock.partial).to.be.calledWith('ignoreCache', options);
    expect(lodashMock.partial).to.be.calledWith('validateConfigByRules', options.rules);
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
