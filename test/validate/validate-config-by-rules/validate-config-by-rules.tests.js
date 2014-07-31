'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-config-by-rules/validate-config-by-rules';

chai.use(sinonChai);

var asyncMock = mockAsync();
var lodashMock = mockLodash();
var sutProxy  = proxyquire(sutPath, {
  'async': asyncMock,
  'lodash': lodashMock,
  './get-item-and-validate': 'getItemAndValidate',
  './get-item-and-validate-values': 'getItemAndValidateValues',
  './get-item-and-validate-values-by-rules': 'getItemAndValidateValuesByRules'
});

describe('validate-config-by-rules', function(){
  it('maps config keys to validation steps in parallel', function(){
    var config = {'somekey': 'someitem'};
    sutProxy('somerules', config, function(err, result){
      expect(asyncMock.parallel).to.be.calledOnce;
      expect(asyncMock.parallel).to.be.calledWithMatch([
        'getItemAndValidate',
        'getItemAndValidateValues',
        'getItemAndValidateValuesByRules'
      ], sinon.match.func);
      expect(lodashMock.partial).to.be.calledWith('getItemAndValidate', 'somekey', config);
      expect(lodashMock.partial).to.be.calledWith('getItemAndValidateValues', 'somekey', config);
      expect(lodashMock.partial).to.be.calledWith('getItemAndValidateValuesByRules', 'somekey', 'somerules', config);
      expect(result).to.deep.equal(['validationResult']);
    });
  });
});

function mockAsync(){
  return {
    parallel: sinon.spy(function(steps, cb){
      cb(null, 'validationResult');
    })
  };
}

function mockLodash(){
  return {
    partial: sinon.spy(function(func){ return func; })
  };
}