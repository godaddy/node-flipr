'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../lib/config-reader/filter-values-by-rules';
chai.use(sinonChai);

var sutProxy;
var asyncMock;
var lodashMock;
var executeRuleMock;
var executeRuleDefaultMock;

describe('filter-values-by-rules', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    executeRuleMock = 'executeRule';
    executeRuleDefaultMock = 'executeRuleDefault';
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      '../rules/execute-rule': executeRuleMock,
      '../rules/execute-rule-default': executeRuleDefaultMock
    });
  });
  it('should throw error if cb is not a function', function(){
    expect(function(){
      sutProxy(null, null, null, null);
    }).to.throw(Error);
  });
  it('should send error to callback if input is not an object', function(){
    sutProxy('notobject', null, null, function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('should send error to callback if rules is not an array', function(){
    sutProxy({}, 'notarray', null, function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('should send error to callback if values is not an array', function(){
    sutProxy({}, [], 'notarray', function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('should send values to callback if values is empty array', function(){
    var values = [];
    sutProxy({}, ['notempty'], values, function(err, result){
      expect(err).to.be.null;
      expect(result).to.equal(values);
    });
  });
  it('should map rules to partial executeRule, add partial executeRuleDefault, and pass to async.waterfall', function(){
    var input = {some:'input'};
    var rules = ['rule1', 'rule2'];
    var values = ['value1'];
    var cb = function(){};
    sutProxy(input, rules, values, cb);
    expect(lodashMock.partial).to.have.been.calledWith(executeRuleMock, input, 'rule1', values);
    expect(lodashMock.partial).to.have.been.calledWith(executeRuleMock, input, 'rule2', values);
    expect(lodashMock.partial).to.have.been.calledWith(executeRuleDefaultMock, values);
    expect(asyncMock.waterfall).to.have.been.calledWith([
      executeRuleMock,
      executeRuleMock,
      executeRuleDefaultMock
    ], cb);
  });
});


function mockAsync(){
  return {
    waterfall: sinon.spy()
  };
}

function mockLodash(){
  return {
    partial: sinon.spy(function(func){ return func; }),
    zipObject: '_.zipObject'
  };
}